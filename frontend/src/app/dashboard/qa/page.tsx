"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import { clsx } from "clsx";

const QA_CHECKS = [
  { id: 1,  category: "Dashboard",   label: "KPI cards load correctly",                        },
  { id: 2,  category: "Dashboard",   label: "Traffic trend chart renders",                      },
  { id: 3,  category: "Dashboard",   label: "Spend vs revenue chart renders",                   },
  { id: 4,  category: "Dashboard",   label: "Recent activity feed loads",                       },
  { id: 5,  category: "Niches",      label: "Niche table loads all 15 niches",                  },
  { id: 6,  category: "Niches",      label: "Search and filter work correctly",                  },
  { id: 7,  category: "Niches",      label: "Approve/Reject buttons work with modal",           },
  { id: 8,  category: "Niches",      label: "Business case screen loads per niche",             },
  { id: 9,  category: "Sites",       label: "Sites grid shows all subdomains",                  },
  { id: 10, category: "Sites",       label: "Site detail view loads pages",                     },
  { id: 11, category: "Sites",       label: "Content preview panel works",                      },
  { id: 12, category: "Sites",       label: "Publish and Rebuild buttons work",                 },
  { id: 13, category: "Links",       label: "Affiliate links table loads all 102 links",        },
  { id: 14, category: "Links",       label: "Search, niche filter and status filter work",      },
  { id: 15, category: "Links",       label: "Refresh bundle button works",                      },
  { id: 16, category: "Campaigns",   label: "Campaigns table loads correctly",                  },
  { id: 17, category: "Campaigns",   label: "Pause and Resume buttons work",                    },
  { id: 18, category: "Budget",      label: "Budget bars show correct percentages",             },
  { id: 19, category: "Budget",      label: "Warning indicators show at 80% and 95%",          },
  { id: 20, category: "Activity",    label: "Agent logs load with pagination",                  },
  { id: 21, category: "Activity",    label: "Agent filter tabs work correctly",                 },
  { id: 22, category: "Alerts",      label: "Alerts load with severity badges",                 },
  { id: 23, category: "Alerts",      label: "Resolve button works",                             },
  { id: 24, category: "Alerts",      label: "Sidebar badge count syncs with unread alerts",    },
  { id: 25, category: "Approvals",   label: "Approval queue loads pending items",               },
  { id: 26, category: "Approvals",   label: "Approve and Reject buttons work",                  },
  { id: 27, category: "Override",    label: "Pause All button shows confirmation modal",        },
  { id: 28, category: "Override",    label: "Individual campaign pause/resume works",           },
  { id: 29, category: "Agents",      label: "All 6 agent cards show status correctly",         },
  { id: 30, category: "Agents",      label: "Run Controller button works",                      },
  { id: 31, category: "Responsive",  label: "Dashboard works on mobile screen",                 },
  { id: 32, category: "Responsive",  label: "Sidebar collapses correctly on small screen",     },
  { id: 33, category: "Browser",     label: "All screens tested on Chrome",                     },
  { id: 34, category: "Browser",     label: "All screens tested on Firefox",                    },
  { id: 35, category: "Browser",     label: "All screens tested on Edge",                       },
];

type CheckStatus = "pending" | "pass" | "fail";

export default function QAPage() {
  const [checks, setChecks] = useState<Record<number, CheckStatus>>(
    Object.fromEntries(QA_CHECKS.map((c) => [c.id, "pending"]))
  );

  const passCount = Object.values(checks).filter((v) => v === "pass").length;
  const failCount = Object.values(checks).filter((v) => v === "fail").length;
  const pendingCount = Object.values(checks).filter((v) => v === "pending").length;
  const progress = Math.round((passCount / QA_CHECKS.length) * 100);
const categories = Array.from(new Set(QA_CHECKS.map((c) => c.category)));

  function setStatus(id: number, status: CheckStatus) {
    setChecks((prev) => ({ ...prev, [id]: status }));
  }

  function resetAll() {
    setChecks(Object.fromEntries(QA_CHECKS.map((c) => [c.id, "pending"])));
  }

  function passAll() {
    setChecks(Object.fromEntries(QA_CHECKS.map((c) => [c.id, "pass"])));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">QA Checklist — Day 7</h1>
          <p className="text-gray-400 mt-1">
            {passCount} passed — {failCount} failed — {pendingCount} pending
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetAll}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <RefreshCw size={14} />
            Reset All
          </button>
          <button
            onClick={passAll}
            className="flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-700 text-green-400 rounded-lg hover:bg-green-900/50 transition-colors text-sm"
          >
            <CheckCircle size={14} />
            Pass All
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-medium">Overall QA Progress</p>
          <span className={clsx(
            "text-lg font-bold",
            progress === 100 ? "text-green-400" : progress > 50 ? "text-yellow-400" : "text-gray-400"
          )}>
            {progress}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className={clsx(
              "h-3 rounded-full transition-all duration-500",
              progress === 100 ? "bg-green-500" : progress > 50 ? "bg-yellow-500" : "bg-blue-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-6 mt-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-400 text-sm">{passCount} Passed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-400 text-sm">{failCount} Failed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-gray-400 text-sm">{pendingCount} Pending</span>
          </div>
        </div>
      </div>

      {/* Checks by category */}
      {categories.map((category) => (
        <div key={category} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <h3 className="text-white font-medium">{category}</h3>
            <span className="text-gray-500 text-sm">
              {QA_CHECKS.filter(c => c.category === category && checks[c.id] === "pass").length}/
              {QA_CHECKS.filter(c => c.category === category).length} passed
            </span>
          </div>
          <div className="divide-y divide-gray-800">
            {QA_CHECKS.filter((c) => c.category === category).map((check) => (
              <div key={check.id} className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  {checks[check.id] === "pass" ? (
                    <CheckCircle size={18} className="text-green-400 shrink-0" />
                  ) : checks[check.id] === "fail" ? (
                    <XCircle size={18} className="text-red-400 shrink-0" />
                  ) : (
                    <Clock size={18} className="text-gray-500 shrink-0" />
                  )}
                  <span className={clsx(
                    "text-sm",
                    checks[check.id] === "pass" ? "text-gray-300" :
                    checks[check.id] === "fail" ? "text-red-400 line-through" :
                    "text-gray-400"
                  )}>
                    {check.label}
                  </span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setStatus(check.id, "pass")}
                    className={clsx(
                      "px-3 py-1 rounded-lg text-xs font-medium transition-colors",
                      checks[check.id] === "pass"
                        ? "bg-green-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-green-900/30 hover:text-green-400"
                    )}
                  >
                    Pass
                  </button>
                  <button
                    onClick={() => setStatus(check.id, "fail")}
                    className={clsx(
                      "px-3 py-1 rounded-lg text-xs font-medium transition-colors",
                      checks[check.id] === "fail"
                        ? "bg-red-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-red-900/30 hover:text-red-400"
                    )}
                  >
                    Fail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {progress === 100 && (
        <div className="bg-green-900/20 border border-green-700 rounded-xl p-6 text-center">
          <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
          <h3 className="text-green-400 font-bold text-xl mb-1">All QA Checks Passed! 🎉</h3>
          <p className="text-gray-400 text-sm">Platform is ready for production deployment and client handover.</p>
        </div>
      )}
    </div>
  );
}