import type { Dictionary } from './mn';

export const en: Dictionary = {
  brand: 'Tsembii',
  meta: {
    title: 'Tsembii — carpet, sofa, mattress and chair cleaning',
    description:
      'Carpet, sofa, mattress and chair cleaning. Add services to your cart and send a request — we will contact you to agree on the price and time.',
  },
  nav: {
    label: 'Main menu',
    home: 'Tsembii — home',
    services: 'Services',
    prices: 'Prices',
    works: 'Our work',
    contact: 'Contact',
  },
  hero: {
    title: 'Leave the cleaning to us.',
    accent: 'Keep your free time.',
    lead: 'Carpet, sofa, mattress and chair cleaning',
    cta: 'Choose a service',
    prices: 'See prices',
    note: ['See prices upfront', 'Send a request online'],
  },
  services: {
    title: 'Services',
    lead: 'You can choose one or several services.',
    empty: 'Services will be added soon.',
  },
  prices: {
    title: 'Prices',
    lead: 'Estimated prices. The final price is agreed with our staff.',
    service: 'Service',
    unit: 'Unit',
    price: 'Price',
    onRequest: 'Price on request',
  },
  units: { SQM: 'm²', PIECE: 'pc', SEAT: 'seat' },
  works: {
    title: 'Our work',
    lead: 'Before and after photos of our work.',
    empty: 'Work photos will be added soon.',
    before: 'Before',
    after: 'After',
  },
  steps: {
    title: 'How to order',
    items: [
      { title: 'Add services', text: 'Choose the services and amounts you need.' },
      { title: 'Verify your phone', text: 'Send an SMS from your number via Verify.mn.' },
      { title: 'Enter address and send', text: 'We will contact you to agree on price and time.' },
    ],
  },
  contact: {
    title: 'Contact',
    phone: 'Phone',
    hours: 'Working hours',
    area: 'Service area',
    cta: 'Continue ordering',
  },
  footer: {
    tagline: 'Carpet, sofa, mattress and chair cleaning — add to cart and send a request.',
    services: 'Services',
    menu: 'Menu',
    social: 'Social',
    rights: 'Tsembii. All rights reserved.',
    poweredBy: 'Powered by',
    language: 'Language',
  },
  legal: {
    updated: 'Last updated',
    privacy: {
      title: 'Privacy Policy',
      intro:
        'Tsembii collects only the minimum information needed to receive and handle cleaning requests. This page explains what we collect and how we use it.',
      sections: [
        {
          title: '1. Information we collect',
          list: [
            'Phone number — to verify it and contact you.',
            'Address and notes — to know where the service is needed.',
            'Selected services, quantities and estimated prices.',
          ],
          text: ['We do not create accounts or ask for passwords, email or profile details.'],
        },
        {
          title: '2. Phone verification',
          text: [
            'Your number is verified via Verify.mn: you send the code shown on the site by SMS from your own number. For this, your number is shared with Verify.mn. Your mobile operator’s SMS rates may apply.',
          ],
        },
        {
          title: '3. How we use information',
          text: [
            'We use your information only to handle your request and contact you about price and time. We do not use it for advertising or sell it to anyone.',
          ],
        },
        {
          title: '4. Storage and security',
          text: [
            'Only authorised staff can view order details. The admin area is password-protected and data is sent over an encrypted connection (HTTPS).',
          ],
        },
        {
          title: '5. Cookies and browser storage',
          list: [
            'Services and quantities in your cart are stored in your browser.',
            'A temporary phone verification cookie is used only to send your request and expires shortly.',
            'Your chosen language is stored in a cookie.',
          ],
          text: ['Your phone number and address are not stored in your browser.'],
        },
        {
          title: '6. Your rights',
          text: [
            'To view, correct or delete your information, call the phone number listed in the Contact section.',
          ],
        },
        {
          title: '7. Changes',
          text: ['If this policy changes, the updated version will be published on this page.'],
        },
      ],
    },
    terms: {
      title: 'Terms of Service',
      intro:
        'These terms apply to sending requests for Tsembii cleaning services through this website. By sending a request, you accept these terms.',
      sections: [
        {
          title: '1. Requests and orders',
          text: [
            'A request sent from the site is not a confirmed order. After receiving it, our staff will contact you to confirm the price and time.',
          ],
        },
        {
          title: '2. Prices',
          list: [
            'Prices and cart totals shown on the site are estimates.',
            'For services marked “Price on request”, the price is agreed with our staff.',
            'The final price is agreed when our staff contacts you.',
            'No online payments are taken on the site.',
          ],
        },
        {
          title: '3. Phone number',
          text: [
            'Before sending a request, you verify your phone number via Verify.mn. Requests from unverified numbers are not accepted.',
          ],
        },
        {
          title: '4. Your responsibility',
          text: [
            'Please enter your phone, address and quantities correctly. Incorrect information may change the price or time.',
          ],
        },
        {
          title: '5. Cancelling or changing',
          text: [
            'To cancel or change your request, call the phone number listed in the Contact section.',
          ],
        },
        {
          title: '6. Personal information',
          text: ['Your information is used in accordance with the Privacy Policy.'],
        },
        {
          title: '7. Changes',
          text: ['If these terms change, the updated version will be published on this page.'],
        },
      ],
    },
  },
};
