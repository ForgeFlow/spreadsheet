import {registry} from "@web/core/registry";

const spreadsheetLoaded = {
    trigger: ".o_spreadsheet_oca_container .o-spreadsheet .o-grid",
    content: "The spreadsheet is loaded",
};

registry.category("web_tour.tours").add("spreadsheet_dashboard_oca_edit", {
    steps: () => [
        {
            trigger:
                ".o_data_row:contains(Tour dashboard) button[name='open_spreadsheet']:enabled",
            content: "Edit the dashboard",
            run: "click",
        },
        spreadsheetLoaded,
        {
            trigger: ".o-topbar-composer .o-composer",
            content: "Focus the composer",
            run: "click",
        },
        {
            trigger: ".o-topbar-composer .o-composer",
            content: "Write a formula",
            run() {
                // The composer is a "plaintext-only" contenteditable
                this.anchor.textContent = "=1+41";
                this.anchor.dispatchEvent(new InputEvent("input", {bubbles: true}));
            },
        },
        {
            trigger: ".o-topbar-composer .o-composer",
            content: "Validate",
            run: "press Enter",
        },
        {
            trigger: ".o-topbar-menu[data-id='file']",
            content: "Open the File menu",
            run: "click",
        },
        {
            trigger: ".o-menu-item[data-name='save']",
            content: "Save the dashboard",
            run: "click",
        },
        {
            trigger: ".o_spreadsheet_oca_name",
            content: "The dashboard is still displayed",
        },
    ],
});

registry.category("web_tour.tours").add("spreadsheet_dashboard_oca_view", {
    steps: () => [
        {
            trigger: ".o_spreadsheet_dashboard_action .o-spreadsheet",
            content: "The dashboard is displayed",
        },
    ],
});

registry.category("web_tour.tours").add("spreadsheet_dashboard_oca_from_spreadsheet", {
    steps: () => [
        {
            trigger: ".o_form_view button[name='open_spreadsheet']",
            content: "Open the spreadsheet",
            run: "click",
        },
        spreadsheetLoaded,
        {
            trigger: ".o-topbar-menu[data-id='file']",
            content: "Open the File menu",
            run: "click",
        },
        {
            trigger: ".o-menu-item[data-name='add_to_dashboard']",
            content: "Add to dashboard",
            run: "click",
        },
        {
            trigger: ".modal div[name='dashboard_group_id'] input",
            content: "Select the dashboard section",
            run: "edit Tour section",
        },
        {
            trigger: ".o-autocomplete--dropdown-item:contains(Tour section)",
            content: "Pick the section",
            run: "click",
        },
        {
            trigger: ".modal button[name='create_dashboard']",
            content: "Create the dashboard",
            run: "click",
        },
        {
            trigger: ".o_spreadsheet_dashboard_action .o-spreadsheet",
            content: "The new dashboard is displayed",
        },
    ],
});

registry.category("web_tour.tours").add("spreadsheet_dashboard_oca_pivot", {
    steps: () => [
        {
            trigger: ".o_pivot_add_spreadsheet",
            content: "Add to spreadsheet",
            run: "click",
        },
        {
            trigger: ".modal div[name='mode_id'] span:contains(New dashboard)",
            content: "Insert in a new dashboard",
            run: "click",
        },
        {
            trigger: ".modal div[name='name'] input",
            content: "Name of the new dashboard",
            run: "edit Tour pivot dashboard",
        },
        {
            trigger: ".modal div[name='dashboard_group_id'] input",
            content: "Select the dashboard section",
            run: "edit Tour section",
        },
        {
            trigger: ".o-autocomplete--dropdown-item:contains(Tour section)",
            content: "Pick the section",
            run: "click",
        },
        {
            trigger: ".modal button[name='insert_pivot']",
            content: "Insert",
            run: "click",
        },
        spreadsheetLoaded,
        {
            trigger: ".o_spreadsheet_oca_name",
            content: "The dashboard name is displayed",
        },
    ],
});
