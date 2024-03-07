import { FormControl } from '@angular/forms';

export const CONFIG = {
  ERROR_MSG: {
    ADD_ADMIN: 'Something went wrong adding admin user..!',
    ADD_SPONSOR: 'Something went wrong adding sponser user..!',
    ADD_RESIDENT: 'Something went wrong adding resident admin..!',
    ADD_ACCOUNTANT: 'Something went wrong adding accountant user..!',
    ADD_SPONSOR_MANAGER: 'Something went wrong adding sponsor manager user..!',
    ADD_BUSINESS_MANAGER: 'Something went wrong adding business manager user..!',
    ADD_RESIDENT_USER: 'Something went wrong adding resident user..!',
    UPDATE_ADMIN: 'Something went wrong updating admin user..!',
    UPDATE_SPONSOR: 'Something went wrong updating sponser user..!',
    UPDATE_RESIDENT: 'Something went wrong updating resident admin..!',
    UPDATE_ACCOUNTANT: 'Something went wrong updating accountant user..!',
    UPDATE_SPONSOR_MANAGER: 'Something went wrong updating sponsor manager user..!',
    UPDATE_BUSINESS_MANAGER: 'Something went wrong updating business manager user..!',
    UPDATE_RESIDENT_USER: 'Something went wrong updating resident user..!',
    UPDATE_PRODUCT: 'Something went wrong while updating product..!',
    LIST_ADMIN: 'Something went wrong getting admin user list..!',
    LIST_SPONSOR: 'Something went wrong getting sponsor user list..!',
    LIST_RESIDENT: 'Something went wrong getting resident admin list..!',
    LIST_ACCOUNTANT: 'Something went wrong getting accountant user list..!',
    LIST_SPONSOR_MANAGER: 'Something went wrong getting sponsor manager user list..!',
    LIST_BUSINESS_MANAGER: 'Something went wrong getting business manager user list..!',
    LIST_RESIDENT_USER: 'Something went wrong getting resident user list..!',
    LIST_RESIDENT_ADMIN: 'Something went wrong getting resident admin list..!',
    LIST_SITE_EMPLOYEE: 'Something went wrong getting site Employee List..!',
    LIST_SITE_SPONSOR: 'Something went wrong getting site Sponsors List..!',
    DELETE_ADMIN: 'Something went wrong deleting admin user..!',
    DELETE_SPONSOR: 'Something went wrong deleting sponsor user..!',
    DELETE_RESIDENT: 'Something went wrong deleting resident admin..!',
    DELETE_ACCOUNTANT: 'Something went wrong deleting accountant user..!',
    DELETE_SPONSOR_MANAGER: 'Something went wrong deleting sponsor manager user..!',
    DELETE_BUSINESS_MANAGER: 'Something went wrong deleting business manager user..!',
    DELETE_RESIDENT_USER: 'Something went wrong deleting resident user..!',
    PASS_SET: 'There is some error while setting the password',
    FORGOTMAIL_SENT: 'Thank you. If you are registered with us, we will send reset password link on your email shortly.',
    UPDATE_USER: 'Something went wrong updating the user..!',
    POST_RESIDENT: 'Could not process your request, please try again later..!',
    UPADTE_STATUS: 'Something went wrong updating the application status..!',
    UPDATE_USER_PIC: 'Something went wrong uploading User image..!',
    UPDATE_COMP_LOGO: 'Something went wrong uploading Company logo..!',
    UPDATE_COMP_INFO: 'Something went wrong updating Company information..!',
    UPDATE_COMP_PITCH: 'Something went wrong updating Pitch deck..!',
    DELETE_MEMBER: 'Something went wrong deleting member information..!',
    UPDATE_CHANGE_REQ: 'Failed to update the change request.',
    GET_COMPANY_DETAILS: 'Failed to get company details.',
    PRODUCT_ADDED: 'Failed to add product.',
    GET_NOTE: 'Something went wrong updating the note..!',
    SAVE_CHANGE_REQUEST: 'Something went wrong while saving Change Request.',
    SOMETHING_WRONG: 'Something went wrong..!',
    POST_SPONSOR_COMPANY: 'Could not process your request, please try again later..!',
    UPDATE_SPONSOR_COMP_LOGO: 'Something went wrong uploading Sponsor Company logo..!',
  },
  SUCCESS_MSG: {
    ADD_ADMIN: 'Admin user added successfully.',
    ADD_SPONSOR: 'Sponsor user added successfully.',
    ADD_PRODUCT: 'Product Added successfully',
    ADD_RESIDENT: 'Resident Admin added successfully.',
    ADD_ACCOUNTANT: 'Accountant user added successfully.',
    ADD_SPONSOR_MANAGER: 'Sponsor Manager user added successfully.',
    ADD_BUSINESS_MANAGER: 'Business Manager user added successfully.',
    ADD_RESIDENT_USER: 'Resident User added successfully.',
    UPDATE_ADMIN: 'Admin user updated successfully.',
    UPDATE_SPONSOR: 'Sponsor user updated successfully.',
    UPDATE_RESIDENT: 'Resident Admin updated successfully.',
    UPDATE_ACCOUNTANT: 'Accountant user updated successfully.',
    UPDATE_SPONSOR_MANAGER: 'Sponsor Manager user updated successfully.',
    UPDATE_BUSINESS_MANAGER: 'Business Manager user updated successfully.',
    UPDATE_RESIDENT_USER: 'Resident User updated successfully.',
    UPDATE_PRODUCT: 'Product Updated successfully',
    DELETE_ADMIN: 'Admin user deleted successfully.',
    DELETE_SPONSOR: 'Sponsor user deleted successfully.',
    DELETE_RESIDENT: 'Resident Admin deleted successfully.',
    DELETE_ACCOUNTANT: 'Accountant user deleted successfully.',
    DELETE_SPONSOR_MANAGER: 'Sponsor Manager user deleted successfully.',
    DELETE_BUSINESS_MANAGER: 'Business Manager user deleted successfully.',
    DELETE_RESIDENT_USER: 'Resident User deleted successfully.',
    PASS_SET: 'You have set your password successfully.',
    FORGOTMAIL_SENT: 'Thank you. If you are registered with us, we will send reset password link on your email shortly.',
    UPDATE_USER: 'User updated successfully.',
    POST_RESIDENT: 'Application form submitted successfully.',
    UPADTE_STATUS: 'Application Status updated successfully.',
    UPDATE_USER_PIC: 'User image uploaded successfully.',
    UPDATE_COMP_LOGO: 'Company logo uploaded successfully.',
    UPDATE_GLOBAL_SPONSOR_LOGO: 'Global Sponsor logo uploaded successfully.',
    UPDATE_COMP_INFO: 'Company information updated successfully.',
    UPDATE_COMP_PITCH: 'Pitch deck uploaded successfully.',
    UPDATE_CHANGE_REQ: 'Change request updated successfully.',
    PRODUCT_ADDED: 'Product added successfully.',
    PRODUCT_UPDATED: 'Product updated successfully.',
    CANCEL_REQUEST: 'Successfully cancelled your request.',
    ADD_SPONSOR_COMPANY: 'Sponsor details added successfully.',
    UPDATE_SPONSOR_COMPANY: 'Sponsor details updated successfully.'
  },
  FILE_CONFIG: {
    FILE_FORMAT: 'File format not supported.',
    FILE_SIZE: 'File size should be less than 5 MB.',
    COMP_LOGO_SIZE: 'File size should be less than 2 MB.',
    PITCH_DECK_SIZE: 'File size should be less than 100 MB.'
  },
  TOASTR: {
    TIMEOUT: 3000,
  },
  REGEX: {
    WEBSITE: '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,7})+)(/(.)*)?(\\?(.)*)?',
    NAME: '^[a-zA-Z-. ]+',
    EMAIL: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
    PHONE: '[0-9]{10,15}',
    NUMBER: '[0-9]',
    CONTACT_NUMBER: '^[0-9+-]*$'
  }

};
export const ROLE = {
  SUPER_ADMIN: 1,
  SITE_ADMIN: 2,
  SPONSOR: 3,
  RESIDENT: 4,
  ACCOUNTANT: 5,
  SPONSOR_MANAGER: 6,
  BUSINESS_MANAGER: 7,
  RESIDENT_USER: 8
};

export let GLOBAL: any = {
  USER: {}
};

export const APPLICATION_STATUS: any = {
  0: 'Applied-New',
  1: 'Current Member',
  2: 'On Hold',
  3: 'Discontinued',
  4: 'Graduated',
  5: 'Applied-Contacted'
};

export const COMMITTEE_STATUS: any = {
  0: 'Unscheduled',
  1: 'Scheduled',
  2: 'Accepted',
  3: 'Rejected',
  4: 'Alternate'
};

export const CHECKLIST_STATUS: any = {
  0: 'Not Started',
  1: 'Assigned',
  2: 'Completed',
  3: 'N/A'
};

export const ONBOARD_OFFOARD_STATUS: any = {
  0: 'Incomplete',
  1: 'Completed',
};

const input = [{
  title: 'some title',
  channel_id: '123we',
  options: [{
    channel_id: 'abc',
    image: 'http://asdasd.com/all-inclusive-block-img.jpg',
    title: 'All-Inclusive',
    options: [{
      channel_id: 'dsa2',
      title: 'Some Recommends',
      options: [{
        image: 'http://www.asdasd.com',
        title: 'Sandals',
        id: '1',
        content: {}
      }]
    }]
  }]
}];

export function findNestedObj(entireObj: any, keyToFind: any, valToFind: any) {
  let foundObj;
  JSON.stringify(entireObj, (_, nestedValue) => {
    if (nestedValue && nestedValue[keyToFind] === valToFind) {
      foundObj = nestedValue;
    }
    return nestedValue;
  });
  return foundObj;
}
export function DateValidator(format = 'MM/dd/YYYY'): any {
  return (control: FormControl): { [key: string]: any } | null => {
    const dateValue = control.value ? control.value.split('-') : null;
    const parsedDate: any = (dateValue && dateValue.length === 3) ? (dateValue[2] + '-' +
    (dateValue[1].length === 2 ? dateValue[1] : `0${dateValue[1]}`) + '-' +
    (dateValue[0].length === 2 ? dateValue[0] : `0${dateValue[0]}`)) : null;
    const value = new Date(parsedDate).getTime();
    const today = new Date().getTime();
    if (today < value || (dateValue && dateValue.length !== 3)) {
      return { futureDate: true };
    }
    return null;
  };
}
export function DateValidators(format = 'MM/dd/YYYY'): any {
  return (control: FormControl): { [key: string]: any } | null => {
    const dateValue = control.value ? control.value.split('-') : null;
    const parsedDate: any = (dateValue && dateValue.length === 3) ? (dateValue[2] + '-' +
    (dateValue[1].length === 2 ? dateValue[1] : `0${dateValue[1]}`) + '-' +
    (dateValue[0].length === 2 ? dateValue[0] : `0${dateValue[0]}`)) : null;
    if ((dateValue && dateValue.length !== 3)) {
      return { validDate: true };
    }
    return null;
  };
}

export function minDateValidator(format = 'MM/dd/YYYY'): any {
  return (control: FormControl): { [key: string]: any } | null => {
    const dateValue = control.value ? control.value.split('-') : null;
    const parsedDate: any = (dateValue && dateValue.length === 3) ? (dateValue[2] + '-' +
    (dateValue[1].length === 2 ? dateValue[1] : `0${dateValue[1]}`) + '-' +
    (dateValue[0].length === 2 ? dateValue[0] : `0${dateValue[0]}`)) : null;
    const value = datetimeFormate(parsedDate);
    const today = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    if (value < today) {
      return { pastDate: true };
    }
    return null;
  };
}

function datetimeFormate(dt: any): any {
  let dateUtc: any = new Date(Date.parse(dt));
  dateUtc = new Date(dateUtc.getTime() + Math.abs(dateUtc.getTimezoneOffset() * 60000)).getTime();
  return (dateUtc);
}

export const COMPANY_STATUS: any = {
  0: 'Applied-New',
  1: 'CurrentMember',
  2: 'OnHold',
  3: 'Discontinued',
  4: 'Graduated',
  5: 'Applied-Contacted'
};

export const ICON: any = {
  95: 'fa-tractor', // Agriculture
  96: 'fa-dog', // Veterinary Medicine
  85: 'fa-syringe', // Surgery
  86: 'fa-stethoscope', // Vision Care
  89: 'fa-diagnoses', // Diagnostics/Biomarkers
  1: 'fa-briefcase-medical', // Therapeutics
  90: 'fa-mortar-pestle', // Lab/Research Tools
  91: 'fa-tablet-alt', // Consumer Product
  94: 'fa-laptop-medical', // Digital Health
  84: 'fa-stethoscope', // Medical Devices
};

export const skipSiteFilterPages: any = [
  '/sponsor-view/search',
  '/sponsor-view/sponsor'
];
export const DEFAULT_MEMBERSHIP_CURRENT = 0;
export const TOTAL_MEMBERSHIP_OPTIONS = 3;

// BIOL-381_tab-highlight
export const highlightTab: any = ['applications', 'company', 'onboarding', 'growth', 'invoicing', 'planchange', 'companyadmin', 'privacy', 'search', 'explore'];

// BIOL-351 Url routing issue
export const siteAdminRestrictUrlArr = ['user', 'invoice-waitlist', 'directory', 'configurations', 'resident-companies'];

export const siteAdminAllowedUrlArr = ['company'];

export const sponsorCompanyTab = ['sponsor-companies', 'sponsoredit', 'sponsorview', 'spusertab', 'spdata'];
