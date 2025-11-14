import { Card, CardContent } from "../reusable/ui/Card";
import { Building2, User2, Stethoscope, CalendarDays } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Hospital Management Dashboard</h1>
        <div className="px-4 py-2 bg-white rounded-full shadow text-sm font-medium">
          Admin
        </div>
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl shadow-sm border border-gray-200">
          <CardContent className="p-6 flex items-center gap-4">
            <Building2 className="w-10 h-10" />
            <div>
              <p className="text-sm text-gray-500">Total Departments</p>
              <p className="text-xl font-semibold">12</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border border-gray-200">
          <CardContent className="p-6 flex items-center gap-4">
            <User2 className="w-10 h-10" />
            <div>
              <p className="text-sm text-gray-500">Active Patients</p>
              <p className="text-xl font-semibold">245</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border border-gray-200">
          <CardContent className="p-6 flex items-center gap-4">
            <Stethoscope className="w-10 h-10" />
            <div>
              <p className="text-sm text-gray-500">Doctors On Duty</p>
              <p className="text-xl font-semibold">38</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border border-gray-200">
          <CardContent className="p-6 flex items-center gap-4">
            <CalendarDays className="w-10 h-10" />
            <div>
              <p className="text-sm text-gray-500">Today's Appointments</p>
              <p className="text-xl font-semibold">76</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="py-2">Patient</th>
              <th className="py-2">Doctor</th>
              <th className="py-2">Department</th>
              <th className="py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b last:border-0">
              <td className="py-3">Rohan Mehta</td>
              <td>Dr. Sharma</td>
              <td>Cardiology</td>
              <td>10:00 AM</td>
            </tr>
            <tr className="border-b last:border-0">
              <td className="py-3">Sarah Khan</td>
              <td>Dr. Patel</td>
              <td>Neurology</td>
              <td>10:45 AM</td>
            </tr>
            <tr className="border-b last:border-0">
              <td className="py-3">Arjun Singh</td>
              <td>Dr. Verma</td>
              <td>Orthopedics</td>
              <td>11:20 AM</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
