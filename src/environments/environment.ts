// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serverUrl: 'http://localhost:3000',
  apiPrefix: '/api',
  apiVersion: '',
  cloudFilePath: 'https://biolabsblobdev.blob.core.windows.net',
  tncfile: 'https://biolabsblobdev.blob.core.windows.net/agreement/Terms_and_Agreement.pdf',
  tncInvite: 'https://biolabsblobdev.blob.core.windows.net/agreement/Terms_&_Agreement_Invite.pdf',
  idleSessionTimeOut: 60 * 30,
  globalDateFormat: 'dd MMM y'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
