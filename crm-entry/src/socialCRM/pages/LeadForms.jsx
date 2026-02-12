import { useEffect, useState } from "react";
import {
  getLeadForms,
  syncLeadsByForm
} from "../api/facebook.leads.api";
import {
  enableForm,
  disableForm
} from "../api/facebook.forms.api";

import PageSelector from "../components/facebook/PageSelector";
import LeadFormCard from "../components/facebook/LeadFormCard";
import { useFacebookPage } from "../context/FacebookPageContext";

export default function LeadForms() {
  const { activePage } = useFacebookPage();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const loadForms = async (silent = false) => {
  if (!activePage) {
    setForms([]);
    return;
  }

  try {
    if (!silent) setLoading(true);
    const data = await getLeadForms(activePage.pageId);
    setForms(data);
  } catch {
    setError("Failed to load lead forms");
  } finally {
    if (!silent) setLoading(false);
  }
};


  // 🔁 AUTO refresh forms (every 30 sec)
  useEffect(() => {
    loadForms(true);

    const interval = setInterval(() => {
      loadForms(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [activePage?.pageId]);

  /* ============================
     ENABLE / DISABLE FORM
     ============================ */
  const toggleForm = async (form) => {
    if (!activePage) return;

    try {
      if (form.isEnabled) {
        await disableForm(activePage.pageId, form.id);
      } else {
        await enableForm(activePage.pageId, form.id);
      }

      // 🔘 manual refresh after toggle
      await loadForms();
    } catch {
      setError("Failed to update form state");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Lead Forms</h1>
          <p className="text-gray-600 mt-1">Manage your Facebook lead generation forms</p>
        </div>

        {/* Page Selector Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <PageSelector />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading forms...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* No Page Selected */}
        {!activePage && !loading && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Page Selected</h3>
            <p className="text-gray-600">Please select a Facebook page to view lead forms</p>
          </div>
        )}

        {/* Forms Grid */}
        {activePage && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Forms Found</h3>
                <p className="text-gray-600">No lead forms available for this page</p>
              </div>
            ) : (
              forms.map(form => (
                <LeadFormCard
                  key={form.id}
                  form={form}
                  onToggle={toggleForm}
                  onSync={syncLeadsByForm}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
