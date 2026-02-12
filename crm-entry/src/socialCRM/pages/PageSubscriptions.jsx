import { useEffect, useState } from "react";
import {
  getAvailablePages,
  subscribePage,
  unsubscribePage
} from "../api/facebook.pages.api";

export default function PageSubscriptions() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPage, setProcessingPage] = useState(null);
  const [notification, setNotification] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAvailablePages();
      console.log("Pages loaded:", data);
      setPages(data);
    } catch (error) {
      console.error("Error loading pages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleSubscription = async (pageId, currentStatus) => {
    setProcessingPage(pageId);
    setNotification(null);
    
    try {
      console.log(`Toggling subscription for page ${pageId}, current status: ${currentStatus}`);
      
      if (currentStatus) {
        // Currently subscribed, so unsubscribe
        console.log("Calling unsubscribe...");
        await unsubscribePage(pageId);
        setNotification({ type: 'success', message: 'Successfully unsubscribed from page' });
      } else {
        // Currently not subscribed, so subscribe
        console.log("Calling subscribe...");
        await subscribePage(pageId);
        setNotification({ type: 'success', message: 'Successfully subscribed to page' });
      }
      
      // Optimistically update the local state immediately
      setPages(prevPages => 
        prevPages.map(page => 
          page.pageId === pageId 
            ? { ...page, isSubscribed: !currentStatus }
            : page
        )
      );
      
      // Then reload from server to confirm after a brief delay
      setTimeout(() => {
        load();
      }, 500);
      
    } catch (error) {
      console.error("Toggle subscription error:", error);
      setNotification({ type: 'error', message: `Failed to ${currentStatus ? 'unsubscribe' : 'subscribe'}` });
      // Revert on error
      await load();
    } finally {
      setProcessingPage(null);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">{notification && (
          <div className={`mb-4 p-4 rounded-xl border-2 flex items-center gap-3 animate-slideIn ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <span className="text-2xl">{notification.type === 'success' ? '✅' : '⚠️'}</span>
            <span className="font-medium">{notification.message}</span>
          </div>
        )}
        
        {/* MODERN HEADER */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl">📄</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Page Subscriptions
              </h1>
              <p className="text-sm text-slate-600 mt-1 flex items-center gap-1.5">
                <span>🔔</span>
                <span>Manage lead generation subscriptions for your Facebook pages</span>
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-600">Loading pages...</p>
            </div>
          </div>
        )}

        {/* Pages List */}
        {!loading && (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            {pages.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📄</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No Pages Found</h3>
                <p className="text-slate-600">No Facebook pages available</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pages.map(p => {
                  const isSubscribed = p.isSubscribed || false;
                  const isProcessing = processingPage === p.pageId;

                  return (
                    <div
                      key={p.pageId}
                      className="p-6 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        {/* Page Info */}
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-800">{p.name}</h3>
                            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span>🆔</span>
                              <code className="text-xs bg-slate-100 px-2 py-0.5 rounded">{p.pageId}</code>
                            </p>
                          </div>
                        </div>

                        {/* Toggle Switch */}
                        <div className="flex items-center gap-4">
                          {/* Status Badge */}
                          <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            isSubscribed 
                              ? "bg-green-100 text-green-700 border border-green-200" 
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}>
                            <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                              isSubscribed ? "bg-green-500 animate-pulse" : "bg-slate-400"
                            }`}></span>
                            {isSubscribed ? "Active" : "Inactive"}
                          </div>

                          {/* Toggle Switch */}
                          <button
                            onClick={() => handleToggleSubscription(p.pageId, isSubscribed)}
                            disabled={isProcessing}
                            className={`relative inline-flex items-center h-8 rounded-full w-16 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                              isSubscribed 
                                ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg" 
                                : "bg-slate-300"
                            }`}
                          >
                            <span className="sr-only">Toggle subscription</span>
                            <span
                              className={`inline-block w-6 h-6 transform transition-all duration-300 bg-white rounded-full shadow-lg flex items-center justify-center ${
                                isSubscribed ? "translate-x-9" : "translate-x-1"
                              }`}
                            >
                              {isProcessing ? (
                                <svg className="animate-spin h-3 w-3 text-blue-600" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                              ) : (
                                <span className="text-xs">{isSubscribed ? "✓" : "✕"}</span>
                              )}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <span>About Lead Subscriptions</span>
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>Enable</strong> lead generation to start receiving leads from your Facebook pages. 
                You can toggle subscriptions on/off at any time using the switch. When <strong>Active</strong>, all leads 
                submitted through your lead forms will be automatically synced to your CRM in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
