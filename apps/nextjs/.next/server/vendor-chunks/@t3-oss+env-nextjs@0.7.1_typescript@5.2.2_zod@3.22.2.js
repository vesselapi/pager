'use strict';
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id =
  'vendor-chunks/@t3-oss+env-nextjs@0.7.1_typescript@5.2.2_zod@3.22.2';
exports.ids = [
  'vendor-chunks/@t3-oss+env-nextjs@0.7.1_typescript@5.2.2_zod@3.22.2',
];
exports.modules = {
  /***/ '(ssr)/../../node_modules/.pnpm/@t3-oss+env-nextjs@0.7.1_typescript@5.2.2_zod@3.22.2/node_modules/@t3-oss/env-nextjs/dist/index.mjs':
    /*!************************************************************************************************************************************!*\
  !*** ../../node_modules/.pnpm/@t3-oss+env-nextjs@0.7.1_typescript@5.2.2_zod@3.22.2/node_modules/@t3-oss/env-nextjs/dist/index.mjs ***!
  \************************************************************************************************************************************/
    /***/ (
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) => {
      eval(
        '__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createEnv: () => (/* binding */ P)\n/* harmony export */ });\n/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! zod */ "(ssr)/../../node_modules/.pnpm/zod@3.22.2/node_modules/zod/lib/index.mjs");\nfunction f(e){let r=e.runtimeEnvStrict??e.runtimeEnv??process.env;if(e.emptyStringAsUndefined??!1)for(let[t,n]of Object.entries(r))n===""&&delete r[t];if(e.skipValidation)return r;let i=typeof e.client=="object"?e.client:{},o=typeof e.server=="object"?e.server:{},s=typeof e.shared=="object"?e.shared:{},d=zod__WEBPACK_IMPORTED_MODULE_0__.z.object(i),T=zod__WEBPACK_IMPORTED_MODULE_0__.z.object(o),l=zod__WEBPACK_IMPORTED_MODULE_0__.z.object(s),v=e.isServer??typeof window>"u",p=d.merge(l),y=T.merge(l).merge(d),c=v?y.safeParse(r):p.safeParse(r),m=e.onValidationError??(t=>{throw console.error("\\u274C Invalid environment variables:",t.flatten().fieldErrors),new Error("Invalid environment variables")}),u=e.onInvalidAccess??(t=>{throw new Error("\\u274C Attempted to access a server-side environment variable on the client")});return c.success===!1?m(c.error):new Proxy(c.data,{get(t,n){if(!(typeof n!="string"||n==="__esModule"||n==="$$typeof"))return!v&&e.clientPrefix&&!n.startsWith(e.clientPrefix)&&l.shape[n]===void 0?u(n):t[n]}})}var x="NEXT_PUBLIC_";function P(e){let r=typeof e.client=="object"?e.client:{},i=typeof e.server=="object"?e.server:{},o=e.shared,s=e.runtimeEnv?e.runtimeEnv:{...process.env,...e.experimental__runtimeEnv};return f({...e,shared:o,client:r,server:i,clientPrefix:x,runtimeEnv:s})}\n//# sourceMappingURL=index.mjs.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0B0My1vc3MrZW52LW5leHRqc0AwLjcuMV90eXBlc2NyaXB0QDUuMi4yX3pvZEAzLjIyLjIvbm9kZV9tb2R1bGVzL0B0My1vc3MvZW52LW5leHRqcy9kaXN0L2luZGV4Lm1qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUF3QixjQUFjLG9EQUFvRCxxRkFBcUYsNkJBQTZCLDJDQUEyQyx3Q0FBd0Msd0NBQXdDLEdBQUcsa0NBQUMsYUFBYSxrQ0FBQyxhQUFhLGtDQUFDLDRJQUE0SSxnSUFBZ0ksNEJBQTRCLCtGQUErRixFQUFFLG1EQUFtRCxTQUFTLG1KQUFtSixFQUFFLHFCQUFxQixjQUFjLDJDQUEyQyx3Q0FBd0MseUNBQXlDLDhDQUE4QyxVQUFVLDREQUE0RCxFQUF5QjtBQUM3dUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AYWNtZS9uZXh0anMvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0B0My1vc3MrZW52LW5leHRqc0AwLjcuMV90eXBlc2NyaXB0QDUuMi4yX3pvZEAzLjIyLjIvbm9kZV9tb2R1bGVzL0B0My1vc3MvZW52LW5leHRqcy9kaXN0L2luZGV4Lm1qcz9hZWVkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydHt6IGFzIGF9ZnJvbVwiem9kXCI7ZnVuY3Rpb24gZihlKXtsZXQgcj1lLnJ1bnRpbWVFbnZTdHJpY3Q/P2UucnVudGltZUVudj8/cHJvY2Vzcy5lbnY7aWYoZS5lbXB0eVN0cmluZ0FzVW5kZWZpbmVkPz8hMSlmb3IobGV0W3Qsbl1vZiBPYmplY3QuZW50cmllcyhyKSluPT09XCJcIiYmZGVsZXRlIHJbdF07aWYoZS5za2lwVmFsaWRhdGlvbilyZXR1cm4gcjtsZXQgaT10eXBlb2YgZS5jbGllbnQ9PVwib2JqZWN0XCI/ZS5jbGllbnQ6e30sbz10eXBlb2YgZS5zZXJ2ZXI9PVwib2JqZWN0XCI/ZS5zZXJ2ZXI6e30scz10eXBlb2YgZS5zaGFyZWQ9PVwib2JqZWN0XCI/ZS5zaGFyZWQ6e30sZD1hLm9iamVjdChpKSxUPWEub2JqZWN0KG8pLGw9YS5vYmplY3Qocyksdj1lLmlzU2VydmVyPz90eXBlb2Ygd2luZG93PlwidVwiLHA9ZC5tZXJnZShsKSx5PVQubWVyZ2UobCkubWVyZ2UoZCksYz12P3kuc2FmZVBhcnNlKHIpOnAuc2FmZVBhcnNlKHIpLG09ZS5vblZhbGlkYXRpb25FcnJvcj8/KHQ9Pnt0aHJvdyBjb25zb2xlLmVycm9yKFwiXFx1Mjc0QyBJbnZhbGlkIGVudmlyb25tZW50IHZhcmlhYmxlczpcIix0LmZsYXR0ZW4oKS5maWVsZEVycm9ycyksbmV3IEVycm9yKFwiSW52YWxpZCBlbnZpcm9ubWVudCB2YXJpYWJsZXNcIil9KSx1PWUub25JbnZhbGlkQWNjZXNzPz8odD0+e3Rocm93IG5ldyBFcnJvcihcIlxcdTI3NEMgQXR0ZW1wdGVkIHRvIGFjY2VzcyBhIHNlcnZlci1zaWRlIGVudmlyb25tZW50IHZhcmlhYmxlIG9uIHRoZSBjbGllbnRcIil9KTtyZXR1cm4gYy5zdWNjZXNzPT09ITE/bShjLmVycm9yKTpuZXcgUHJveHkoYy5kYXRhLHtnZXQodCxuKXtpZighKHR5cGVvZiBuIT1cInN0cmluZ1wifHxuPT09XCJfX2VzTW9kdWxlXCJ8fG49PT1cIiQkdHlwZW9mXCIpKXJldHVybiF2JiZlLmNsaWVudFByZWZpeCYmIW4uc3RhcnRzV2l0aChlLmNsaWVudFByZWZpeCkmJmwuc2hhcGVbbl09PT12b2lkIDA/dShuKTp0W25dfX0pfXZhciB4PVwiTkVYVF9QVUJMSUNfXCI7ZnVuY3Rpb24gUChlKXtsZXQgcj10eXBlb2YgZS5jbGllbnQ9PVwib2JqZWN0XCI/ZS5jbGllbnQ6e30saT10eXBlb2YgZS5zZXJ2ZXI9PVwib2JqZWN0XCI/ZS5zZXJ2ZXI6e30sbz1lLnNoYXJlZCxzPWUucnVudGltZUVudj9lLnJ1bnRpbWVFbnY6ey4uLnByb2Nlc3MuZW52LC4uLmUuZXhwZXJpbWVudGFsX19ydW50aW1lRW52fTtyZXR1cm4gZih7Li4uZSxzaGFyZWQ6byxjbGllbnQ6cixzZXJ2ZXI6aSxjbGllbnRQcmVmaXg6eCxydW50aW1lRW52OnN9KX1leHBvcnR7UCBhcyBjcmVhdGVFbnZ9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXgubWpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/.pnpm/@t3-oss+env-nextjs@0.7.1_typescript@5.2.2_zod@3.22.2/node_modules/@t3-oss/env-nextjs/dist/index.mjs\n',
      );

      /***/
    },
};
