import { useSetAtom } from "jotai";
import { Card, CardContent } from "../reusable/ui/Card";
import { Building2, User2, Stethoscope, CalendarDays } from "lucide-react";
import { addNotificationAtom } from "../store/notificationAtoms";
import { useEffect } from "react";
import NotificationBell from "../components/notification/NotificationBell";

const dashboardStats = [
    {
        id: 1,
        title: "Total Departments",
        value: 12,
        icon: <Building2 className="w-10 h-10" />
    },
    {
        id: 2,
        title: "Active Patients",
        value: 245,
        icon: <User2 className="w-10 h-10" />
    },
    {
        id: 3,
        title: "Doctors On Duty",
        value: 38,
        icon: <Stethoscope className="w-10 h-10" />
    },
    {
        id: 4,
        title: "Today's Appointments",
        value: 76,
        icon: <CalendarDays className="w-10 h-10" />
    }
];

const tableData = [
    {
        patient: "Rohan Mehta",
        doctor: "Dr. Sharma",
        department: "Cardiology",
        time: "10:00 AM"
    },
    {
        patient: "Sarah Khan",
        doctor: "Dr. Patel",
        department: "Neurology",
        time: "10:45 AM"
    },
    {
        patient: "Arjun Singh",
        doctor: "Dr. Verma",
        department: "Orthopedics",
        time: "11:20 AM"
    }
];
export default function Dashboard() {
    const addNotification = useSetAtom(addNotificationAtom);

    useEffect(() => {
        addNotification({
            id: crypto.randomUUID(),
            message: "New appointment request from Rohan Mehta.",
            type: "appointment",
            createdAt: new Date().toISOString(),
            status: "pending"
        });
    }, [])


    return (
        <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold tracking-tight">Hospital Management Dashboard</h1>

                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-white rounded-full shadow text-sm font-medium">
                        Admin
                    </div>

                    <NotificationBell />
                </div>
            </header>


            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map(stat => (
                    <Card key={stat.id} className="rounded-2xl shadow-sm border border-gray-200">
                        <CardContent className="p-6 flex items-center gap-4">
                            {stat.icon}
                            <div>
                                <p className="text-sm text-gray-500">{stat.title}</p>
                                <p className="text-xl font-semibold">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
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
                        {tableData.map((appointment, index) => (
                            <tr key={index} className="border-b last:border-0">
                                <td className="py-3">{appointment.patient}</td>
                                <td>{appointment.doctor}</td>
                                <td>{appointment.department}</td>
                                <td>{appointment.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
