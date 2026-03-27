import{c as t,j as e,a as o,R as s}from"./index-DFM0M5ai.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n=t("Eraser",[["path",{d:"m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21",key:"182aya"}],["path",{d:"M22 21H7",key:"t4ddhn"}],["path",{d:"m5 11 9 9",key:"1mo9qw"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=t("HelpCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=t("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=t("Zap",[["polygon",{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2",key:"45s27k"}]]);function h(){const r=()=>{chrome&&chrome.runtime?(chrome.runtime.sendMessage({action:"trigger_autofill"}),window.close()):console.log("AutoFill Triggered (Dev Mode)")},a=()=>{chrome&&chrome.runtime?(chrome.runtime.sendMessage({action:"trigger_autoclear"}),window.close()):console.log("AutoClear Triggered (Dev Mode)")},l=()=>{chrome&&chrome.runtime?chrome.runtime.openOptionsPage():window.open("../options.html","_blank")};return e.jsxs("div",{className:"flex flex-col gap-4 p-6 bg-white w-full",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("h2",{className:"text-[22px] font-extrabold text-primary-600 tracking-tight leading-none",children:"AutoFiller"}),e.jsx("p",{className:"text-[13px] font-semibold text-gray-500 mt-0.5",children:"Quick Actions"})]}),e.jsxs("button",{onClick:r,className:"flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer",children:[e.jsx(d,{size:18,className:"fill-white"}),"AutoFill Now"]}),e.jsxs("button",{onClick:a,className:"flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-danger-500 hover:bg-danger-600 text-white rounded-xl font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer",children:[e.jsx(n,{size:18}),"Auto Clear"]}),e.jsx("hr",{className:"border-gray-100 my-1"}),e.jsxs("div",{className:"flex flex-row gap-2",children:[e.jsxs("button",{onClick:l,className:"flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 rounded-lg font-bold transition-all hover:-translate-y-px cursor-pointer shadow-sm",children:[e.jsx(c,{size:16,className:"text-gray-600"}),"Settings"]}),e.jsx("a",{href:"../help.html",target:"_blank",title:"Help & Docs",className:"flex items-center justify-center p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all hover:-translate-y-px shadow-sm cursor-pointer",children:e.jsx(i,{size:18})})]})]})}o.createRoot(document.getElementById("root")).render(e.jsx(s.StrictMode,{children:e.jsx(h,{})}));
