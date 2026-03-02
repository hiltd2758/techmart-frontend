import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authAPI } from "../../api/customerAPI";

const VerifyPage = () => {
  const { token: urlToken } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle"); // idle, verifying, success, error
  const [message, setMessage] = useState("");
  const [tokenInput, setTokenInput] = useState(urlToken || "");
  const [inputError, setInputError] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [resendUsername, setResendUsername] = useState("");
  const [resendStatus, setResendStatus] = useState("idle"); // idle, sending, sent, error
  const [resendMessage, setResendMessage] = useState("");

  const verifyAccount = async (tokenValue) => {
    if (!tokenValue.trim()) {
      setInputError("Please enter your verification token.");
      return;
    }
    setInputError("");
    setStatus("verifying");
    try {
      const { data } = await authAPI.verifyUser(tokenValue.trim());
      setStatus("success");
      setMessage(data.message || "Account verified successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setStatus("error");
      setMessage(
        error.response?.data?.message ||
          "Verification failed. Token may be invalid or expired.",
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyAccount(tokenInput);
  };

  const handleTryAgain = () => {
    setStatus("idle");
    setTokenInput("");
    setMessage("");
    setInputError("");
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendUsername.trim()) return;
    setResendStatus("sending");
    setResendMessage("");
    try {
      const { data } = await authAPI.resendVerification(resendUsername.trim());
      setResendStatus("sent");
      setResendMessage(
        data.message || "Verification email sent! Please check your inbox.",
      );
    } catch (error) {
      setResendStatus("error");
      setResendMessage(
        error.response?.data?.message || "Failed to resend. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-neutral-200 p-12 text-center">
        {(status === "idle" || status === "verifying") && (
          <>
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-neutral-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-neutral-900 mb-2">
              Verify Your Email
            </h2>
            <p className="text-sm text-neutral-500 mb-8">
              Enter the verification token sent to your email address.
            </p>
            <form onSubmit={handleSubmit} className="text-left space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5 uppercase tracking-wide">
                  Verification Token
                </label>
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => {
                    setTokenInput(e.target.value);
                    if (inputError) setInputError("");
                  }}
                  placeholder="Paste your token here"
                  disabled={status === "verifying"}
                  className={`w-full border px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-50 disabled:cursor-not-allowed ${
                    inputError ? "border-red-400" : "border-neutral-300"
                  }`}
                />
                {inputError && (
                  <p className="mt-1 text-xs text-red-500">{inputError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={status === "verifying"}
                className="w-full bg-neutral-900 text-white py-2.5 text-sm font-medium hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === "verifying" ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Verifying...
                  </>
                ) : (
                  "Verify Account"
                )}
              </button>
            </form>

            {/* Resend verification */}
            <div className="mt-6 pt-6 border-t border-neutral-100">
              {!showResend ? (
                <p className="text-sm text-neutral-500">
                  Didn't receive a token?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setShowResend(true);
                      setResendStatus("idle");
                      setResendMessage("");
                    }}
                    className="text-neutral-900 font-medium underline underline-offset-2 hover:text-neutral-600"
                  >
                    Resend verification email
                  </button>
                </p>
              ) : (
                <div className="text-left">
                  <p className="text-xs font-medium text-neutral-700 uppercase tracking-wide mb-3">
                    Resend Verification Email
                  </p>
                  {resendStatus === "sent" ? (
                    <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2.5">
                      <svg
                        className="w-4 h-4 mt-0.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{resendMessage}</span>
                    </div>
                  ) : (
                    <form onSubmit={handleResend} className="flex gap-2">
                      <input
                        type="text"
                        value={resendUsername}
                        onChange={(e) => setResendUsername(e.target.value)}
                        placeholder="Enter your username"
                        disabled={resendStatus === "sending"}
                        className="flex-1 border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-50 disabled:cursor-not-allowed"
                      />
                      <button
                        type="submit"
                        disabled={
                          resendStatus === "sending" || !resendUsername.trim()
                        }
                        className="bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
                      >
                        {resendStatus === "sending" ? (
                          <>
                            <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></span>
                            Sending...
                          </>
                        ) : (
                          "Send"
                        )}
                      </button>
                    </form>
                  )}
                  {resendStatus === "error" && (
                    <p className="mt-2 text-xs text-red-500">{resendMessage}</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-neutral-900 mb-2">
              Account Verified!
            </h2>
            <p className="text-sm text-neutral-500 mb-4">{message}</p>
            <p className="text-xs text-neutral-400">
              Redirecting to login page...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-neutral-900 mb-2">
              Verification Failed
            </h2>
            <p className="text-sm text-neutral-500 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={handleTryAgain}
                className="w-full bg-neutral-900 text-white py-2.5 font-medium hover:bg-neutral-800"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full border border-neutral-300 text-neutral-900 py-2.5 font-medium hover:bg-neutral-50"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="w-full border border-neutral-300 text-neutral-900 py-2.5 font-medium hover:bg-neutral-50"
              >
                Register Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;
