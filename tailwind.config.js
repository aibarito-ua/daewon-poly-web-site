module.exports = {
  purge: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  content: [
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  extend: {
  },
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
  theme: {
    extend: {
      backgroundImage: {
        'outline-box-img': "url('/src/util/png/textKeyBox.png')",
        'outline-white-box': "url('/src/util/png/outlineTextSubBox.png)",
        'login-img': "url('/src/util/svgs/loginBackgroundImage.svg')",
        'speaking-hub-logo': "url('/src/util/svgs/speakingHubLogo.svg')",
        'writing-hub-logo': "url('/src/util/svgs/writingHubLogo.svg')",
        'modal-warning-icon': "url('/src/components/toggleModalComponents/img/warning_icon.svg')",
        'menu-inner-img': "url('/src/util/svgs/menu-inner-bg.svg')",
        'unit-book-icon': "url('/src/util/svgs/writing-activity-unit-book-icon.svg')",
        'unit-select-book-icon': "url('/src/util/svgs/writing-activity-unit-select-book-icon.svg')",
        'unit-complete-report-icon': "url('/src/util/svgs/complete-report-icon.svg')",
        'unit-complete-flower-icon': "url('/src/util/svgs/unit-complete-flower-icon.svg')",
        'back-in-draft-icon': "url('/src/util/svgs/btn-back-page-icon.svg')",
        'draft-background-image': "url('/src/util/svgs/draft-background-image.svg')",
        'chatbot-ella-button-icon': "url('/src/util/svgs/btn-chatbot-ella.svg')",
        'report-rechart-custom-tooltip-box-organization': "url('/src/components/chartComponents/tooltips/polygons/reportTooltipOrganization.svg')",
        'report-rechart-custom-tooltip-box-voice': "url('/src/components/chartComponents/tooltips/polygons/reportTooltipVoice.svg')",
        'report-rechart-custom-tooltip-box-sentencefluency': "url('/src/components/chartComponents/tooltips/polygons/reportTooltipSentenceFluency.svg')",
        'report-rechart-custom-tooltip-box-wordchoice': "url('/src/components/chartComponents/tooltips/polygons/reportTooltipWordChoice.svg')",
        'report-rechart-custom-tooltip-box-ideas': "url('/src/components/chartComponents/tooltips/polygons/reportTooltipIdeas.svg')",
        'report-rechart-custom-tooltip-box-conventions': "url('/src/components/chartComponents/tooltips/polygons/reportTooltipConventions.svg')",
        'unit-report-modal-active-manu': "url('/src/components/toggleModalComponents/img/reportActiveMenu.svg')",
        'print-writing-hub-memo-icon': "url('/src/components/toggleModalComponents/img/printReportMemoIcon.svg')",
      }
    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
      'full': '100%'
    },
  }
}
