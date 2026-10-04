# Copyright 2026 ForgeFlow S.L.
# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
import json

from odoo.tests import HttpCase, tagged


@tagged("post_install", "-at_install")
class TestSpreadsheetDashboardUi(HttpCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.dashboard_group = cls.env["spreadsheet.dashboard.group"].create(
            {"name": "Tour section"}
        )
        cls.dashboard = cls.env["spreadsheet.dashboard"].create(
            {
                "name": "Tour dashboard",
                "dashboard_group_id": cls.dashboard_group.id,
                "group_ids": [(6, 0, cls.env.ref("base.group_user").ids)],
            }
        )
        cls.spreadsheet = cls.env["spreadsheet.spreadsheet"].create(
            {
                "name": "Tour spreadsheet to dashboard",
                "owner_id": cls.env.ref("base.user_admin").id,
            }
        )
        cls.partner_action = cls.env["ir.actions.act_window"].create(
            {
                "name": "Tour partners",
                "res_model": "res.partner",
                "view_mode": "pivot,list",
            }
        )

    def test_edit_dashboard(self):
        self.assertTrue(self.dashboard.can_edit)
        self.start_tour(
            "/odoo/action-spreadsheet_dashboard."
            "spreadsheet_dashboard_action_configuration_dashboards",
            "spreadsheet_dashboard_oca_edit",
            login="admin",
        )
        self.assertIn("=1+41", self.dashboard.spreadsheet_data)
        self.assertIn("=1+41", json.dumps(self.dashboard.spreadsheet_raw))
        # The edited dashboard is displayed in the Dashboards app
        self.start_tour(
            f"/odoo/dashboards?dashboard_id={self.dashboard.id}",
            "spreadsheet_dashboard_oca_view",
            login="admin",
        )

    def test_spreadsheet_to_dashboard(self):
        self.start_tour(
            "/odoo/action-spreadsheet_oca.spreadsheet_spreadsheet_act_window/"
            f"{self.spreadsheet.id}",
            "spreadsheet_dashboard_oca_from_spreadsheet",
            login="admin",
        )
        dashboard = self.env["spreadsheet.dashboard"].search(
            [("name", "=", "Tour spreadsheet to dashboard")]
        )
        self.assertEqual(len(dashboard), 1)
        self.assertEqual(dashboard.dashboard_group_id, self.dashboard_group)

    def test_pivot_to_new_dashboard(self):
        self.start_tour(
            f"/odoo/action-{self.partner_action.id}",
            "spreadsheet_dashboard_oca_pivot",
            login="admin",
        )
        dashboard = self.env["spreadsheet.dashboard"].search(
            [("name", "=", "Tour pivot dashboard")]
        )
        self.assertEqual(len(dashboard), 1)
        revisions = self.env["spreadsheet.oca.revision"].search(
            [("model", "=", dashboard._name), ("res_id", "=", dashboard.id)]
        )
        commands = [
            command["type"]
            for revision in revisions
            for command in json.loads(revision.commands).get("commands", [])
        ]
        self.assertIn("ADD_PIVOT", commands)
