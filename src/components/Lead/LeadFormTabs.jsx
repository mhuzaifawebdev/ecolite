import { useState, useEffect } from "react";
import { AlertTriangle, Save, X } from "lucide-react";
import PropTypes from "prop-types";
import navigationGuard from "../../utils/navigationGuard";

LeadFormTabs.propTypes = {
    step: PropTypes.number.isRequired,
    setStep: PropTypes.func.isRequired,
    hasUnsavedChanges: PropTypes.bool,
    onSaveData: PropTypes.func
};

export default function LeadFormTabs({ step, setStep, hasUnsavedChanges = true, onSaveData }) {
    const [showPopup, setShowPopup] = useState(false);
    const [pendingStep, setPendingStep] = useState(null);

    const handleStepChange = (newStep) => {
        if (hasUnsavedChanges && newStep !== step) {
            setPendingStep(newStep);
            setShowPopup(true);
        } else {
            setStep(newStep);
        }
    };

    const handleSaveAndContinue = () => {
        if (onSaveData) {
            onSaveData();
        }
        if (pendingStep) {
            setStep(pendingStep);
        }
        setShowPopup(false);
        setPendingStep(null);
        
        // Allow navigation after saving
        if (window._navigationResolver) {
            window._navigationResolver(true);
            window._navigationResolver = null;
        }
    };

    const handleContinueWithoutSaving = () => {
        if (pendingStep) {
            setStep(pendingStep);
        }
        setShowPopup(false);
        setPendingStep(null);
        
        // Allow navigation without saving
        if (window._navigationResolver) {
            window._navigationResolver(true);
            window._navigationResolver = null;
        }
    };

    const handleCancel = () => {
        setShowPopup(false);
        setPendingStep(null);
        
        // Prevent navigation
        if (window._navigationResolver) {
            window._navigationResolver(false);
            window._navigationResolver = null;
        }
    };

    // Handle page unload/refresh and navigation
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        // Set up navigation guard
        if (hasUnsavedChanges) {
            navigationGuard.setNavigationGuard(() => {
                setShowPopup(true);
                return new Promise(resolve => {
                    // Store the resolve function to be called when user makes a choice
                    window._navigationResolver = resolve;
                });
            });
        } else {
            navigationGuard.removeNavigationGuard();
        }

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            navigationGuard.removeNavigationGuard();
        };
    }, [hasUnsavedChanges]);

    return (
        <>
            <div className="w-full my-5">
                <div className="relative right-0">
                    <ul className="relative flex flex-wrap px-1.5 py-1.5 list-none rounded-md bg-slate-200" data-tabs="tabs" role="list">
                        <li className="z-30 flex-auto text-center">
                            <a
                                className={`z-30 flex items-center justify-center w-full px-0 py-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer ${
                                    step === 1 ? "bg-white shadow-sm" : "text-slate-600 bg-inherit hover:text-slate-800"
                                }`}
                                onClick={() => handleStepChange(1)}
                                role="tab"
                                aria-selected={step === 1}
                            >
                                Lead Information
                            </a>
                        </li>
                        <li className="z-30 flex-auto text-center">
                            <a
                                className={`z-30 flex items-center justify-center w-full px-0 py-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-lg cursor-pointer ${
                                    step === 2 ? "bg-white shadow-sm" : "text-slate-600 bg-inherit hover:text-slate-800"
                                }`}
                                onClick={() => handleStepChange(2)}
                                role="tab"
                                aria-selected={step === 2}
                            >
                                Pre Qualification
                            </a>
                        </li>
                        <li className="z-30 flex-auto text-center">
                            <a
                                className={`z-30 flex items-center justify-center w-full px-0 py-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-lg cursor-pointer ${
                                    step === 3 ? "bg-white shadow-sm" : "text-slate-600 bg-inherit hover:text-slate-800"
                                }`}
                                onClick={() => handleStepChange(3)}
                                role="tab"
                                aria-selected={step === 3}
                            >
                                RDSAP
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Aesthetic Popup Overlay */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Unsaved Changes
                                </h3>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                You have unsaved changes in your form. Would you like to save your progress before moving to the next step?
                            </p>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col space-y-3">
                                <button
                                    onClick={handleSaveAndContinue}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-200"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Save & Continue</span>
                                </button>
                                
                                <button
                                    onClick={handleContinueWithoutSaving}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    Continue Without Saving
                                </button>
                                
                                <button
                                    onClick={handleCancel}
                                    className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}