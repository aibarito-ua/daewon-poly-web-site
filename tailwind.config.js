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
        'writing-hub-logo': "url('/src/util/svgs/writingHubLogo.png')",
        'modal-warning-icon': "url('/src/components/toggleModalComponents/img/warning_icon.svg')",
        'menu-inner-img': "url('/src/util/svgs/menu-inner-bg.svg')",
        'unit-book-icon': "url('/src/util/svgs/writing-activity-unit-book-icon.svg')",
        'unit-select-book-icon': "url('/src/util/svgs/writing-activity-unit-select-book-icon.svg')",
        'unit-complete-report-icon': "url('/src/util/svgs/complete-report-icon.png')",
        'unit-complete-flower-icon': "url('/src/util/svgs/unit-complete-flower-icon.png')",
        'back-in-draft-icon': "url('/src/util/svgs/commonIconPNG/btn-back-page-icon.png')",
        'draft-background-image': "url('/src/util/svgs/draft-background-image.svg')",
        'chatbot-ella-button-icon': "url('/src/util/png/bt_chatbot.png')",
        'report-rechart-custom-tooltip-box-organization': "url('/src/components/chartComponents/tooltips/polygons/reportTooltipOrganization.svg')",
        'report-rechart-custom-tooltip-box-voice': "url('/src/components/chartComponents/tooltips/polygons/reportTooltipVoice.svg')",
        'report-rechart-custom-tooltip-box-sentencefluency': "url('/src/components/chartComponents/tooltips/polygons/reportTooltipSentenceFluency.svg')",
        'report-rechart-custom-tooltip-box-wordchoice': "url('/src/components/chartComponents/tooltips/polygons/reportTooltipWordChoice.svg')",
        'report-rechart-custom-tooltip-box-ideas': "url('/src/components/chartComponents/tooltips/polygons/reportTooltipIdeas.svg')",
        'report-rechart-custom-tooltip-box-conventions': "url('/src/components/chartComponents/tooltips/polygons/reportTooltipConventions.svg')",
        'unit-report-modal-active-manu': "url('/src/util/png/reportActiveMenu.png')",
        'print-writing-hub-memo-icon': "url('/src/components/toggleModalComponents/img/printReportMemoIcon.svg')",
        'teacher-feedback-more-comment-detail-button-icon': "url('/src/util/png/btn-docs-find-icon.png')",
        
        'draft-2nd-fresh-page-button-svg':"url('/src/util/png/draft2nd/bt_fresh.png')",
        'draft-2nd-revise-1st-button-svg':"url('/src/util/png/draft2nd/bt_revise.png')",

        'draft-2nd-save-button-svg': "url('/src/util/svgs/bt_save.svg')",
        'draft-2nd-save-button-readonly-svg': "url('/src/util/svgs/bt_save_readonly.svg')",
        'draft-2nd-submit-button-svg': "url('/src/util/svgs/bt_submit.svg')",
        'draft-2nd-submit-button-readonly-svg': "url('/src/util/svgs/bt_submit_readonly.svg')",

        'app-close-button-svg': "url('/src/util/svgs/bt_exit_login.svg')",
        'modal-close-button-svg': "url('/src/util/png/buttons/bt_close.png')",
        // user no profile image use this image
        'user-no-profile-image-view': "url('/src/util/png/no_image_profile.png')",
        // report tab bg 
        'tab-title-active-bg-svg': "url('/src/util/png/active_tab.png')",
        // report no data img
        'tab-no-data-img-svg': "url('/src/util/svgs/report/img.svg')",
        // report pie legend - overall
        'tab-overall-pie-legend-img-svg': "url('/src/util/svgs/report/overallPieLegend.svg')",
        // report bar legend - overall
        'tab-overall-bar-legend-img-svg': "url('/src/util/svgs/report/overallBarLegend.svg')",
        // in report, rubric button icon
        'tab-overall-rubric-ic-svg': "url('/src/components/toggleModalComponents/img/bt_rubric_report.svg')",
        // in rubric report modal left&right button
        'tab-rubric-modal-left': "url('/src/util/png/buttons/btn_prev.png')",
        'tab-rubric-modal-right': "url('/src/util/png/buttons/btn_next.png')",
        // in report, report by unit left&right button
        'tab-report-prev': "url('/src/util/png/buttons/bt_prev.png')",
        'tab-report-next': "url('/src/util/png/buttons/bt_next.png')",
        // in report, rubric left&right disabled button
        'tab-prev-btn-disabled': "url('/src/util/png/buttons/btn_prev_disabled.png')",
        'tab-next-btn-disabled': "url('/src/util/png/buttons/btn_next_disabled.png')",
        // in report page, print button icon
        'tab-print-btn-ic-svg': "url('/src/components/commonComponents/printComponent/report/svgs/bt_print.svg')",
        // print report writing hub icon
        'report-ic-wr': "url('/src/components/commonComponents/printComponent/report/svgs/ic_wr.svg')",
        // in activity page, modal, btn rubric
        'btn-rubric-modal-ic-svg': "url('/src/util/svgs/bt_rubric.svg')",
        // in activity page, modal, print button icon
        'btn-report-modal-print-ic-svg': "url('/src/util/png/bt_print.png')",
        'portfolio-unit-open-bg-svg': "url('/src/util/png/portfolio/unitBG.png')",
        'portfolio-unit-lock-bg-svg': "url('/src/util/png/portfolio/unitLock.png')",
        // portfolio crown
        'portfolio-unit-crown-ic-svg': "url('/src/components/pageComponents/portfolio/svgs/ic_medal.svg')",
        // portfolio modal small crown
        'portfolio-unit-modal-crown-ic-svg':"url('/src/components/pageComponents/portfolio/svgs/smallCrown.svg')",
        // nav side icons
        'nav-writing-activity-on': "url('/src/util/svgs/commonIconPNG/nav_writing_activity_on.png')",
        'nav-writing-activity-off': "url('/src/util/svgs/commonIconPNG/nav_writing_activity_off.png')",
        'nav-progress-on': "url('/src/util/svgs/commonIconPNG/nav_progress_on.png')",
        'nav-progress-off': "url('/src/util/svgs/commonIconPNG/nav_progress_off.png')",
        'nav-report-on': "url('/src/util/svgs/commonIconPNG/nav_report_on.png')",
        'nav-report-off': "url('/src/util/svgs/commonIconPNG/nav_report_off.png')",
        'nav-portfolio-on': "url('/src/util/svgs/commonIconPNG/nav_portfolio_on.png')",
        'nav-portfolio-off': "url('/src/util/svgs/commonIconPNG/nav_portfolio_off.png')",

        // progress small icons
        'progress-status-ic-blue-entry-circle': "url(/src/util/png/progress/ic_entry_3x.png)",
        'progress-status-ic-green-check-circle': "url(/src/util/png/progress/checkGreenCircleIcon.png)",
        'progress-status-ic-red-recycle-circle': "url(/src/util/png/progress/recycleRedCircleIcon.png)",
        'progress-status-ic-blue-wait-rect' : "url(/src/util/png/progress/ic_blue_wait_rect.png)",

        // unit select icons
        'unit-box-status-ic-entry':"url('/src/util/png/unitSelect/ic_entry.png')",
        'unit-box-status-ic-no_entry':"url('/src/util/png/unitSelect/ic_no_entry.png')",
        'unit-box-status-ic-reject':"url('/src/util/png/unitSelect/ic_reject.png')",
        'unit-box-status-ic-save':"url('/src/util/png/unitSelect/ic_save.png')",
        'unit-box-status-ic-complete':"url('/src/util/png/unitSelect/ic_complete.png')",
        'unit-box-status-ic-ing':"url('/src/util/png/unitSelect/ing_border.png')",
        'unit-box-bookmark':"url('/src/util/png/unitSelect/bookmark.png')",

        // select box down arrow
        'select-box-down-ic-arrow': "url('/src/util/png/selectBox/ic_arrow_down.png')",

        // 
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
