import { useSetAtom, useAtom } from "jotai";
import { Card, CardContent } from "../reusable/ui/Card";
import { Building2, User2, Stethoscope, CalendarDays } from "lucide-react";
import { addNotificationAtom } from "../store/notificationAtoms";
import { userAtom } from "../store/userAtom";
import NotificationBell from "../components/notification/NotificationBell";
import { useEffect, useState } from "react";
import ReferPatientModal from "../components/modal/ReferPatientModal";
import { getPatientsService } from "../services/api/users/getUsersService";

const dashboardStats = [
    { id: 1, title: "Total Departments", value: 12, icon: <Building2 className="w-10 h-10" /> },
    { id: 2, title: "Active Patients", value: 245, icon: <User2 className="w-10 h-10" /> },
    { id: 3, title: "Doctors On Duty", value: 38, icon: <Stethoscope className="w-10 h-10" /> },
    { id: 4, title: "Today's Appointments", value: 76, icon: <CalendarDays className="w-10 h-10" /> }
];

// Doctor Data
const doctorStats = [
    { id: 1, title: "Today's Patients", value: 3 },
    { id: 2, title: "Pending Approvals", value: 2 },
    { id: 3, title: "Completed Appointments", value: 9 }
];

const doctorPatients = [
    { patient: "Rahul Singh", time: "9:30 AM" },
    { patient: "Meera Kapoor", time: "10:15 AM" },
    { patient: "Tanish Gupta", time: "11:00 AM" }
];

// Patient Data
const patientAppointments = [
    { doctor: "Dr. Sharma", department: "Cardiology", time: "10:00 AM", status: "Confirmed" }
];

// {
//   "_id": "6916f060e47325ff8206e5f1",
//   "name": "jasi Kumar",
//   "email": "jasi@gmail.com",
//   "role": "user",
//   "password": "123456"
// }

export default function Dashboard() {
    const addNotification = useSetAtom(addNotificationAtom);
    const [user] = useAtom(userAtom);

    useEffect(() => {
        if (user?.role === "doctor") {
            addNotification({
                id: crypto.randomUUID(),
                message: "New appointment request for 12:30 PM.",
                type: "appointment",
                createdAt: new Date().toISOString(),
                status: "pending"
            });
        }
    }, [user?.role]);

    const [patients, setPatients] = useState<any>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getPatientsService();
                setPatients(data ?? []);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {user?.role === "admin" && "Hospital Management Dashboard"}
                    {user?.role === "doctor" && "Doctor Dashboard"}
                    {user?.role === "patient" && "Your Appointments"}
                </h1>

                <div className="flex items-center gap-4">
                    {user?.role === "doctor" && <NotificationBell />}
                </div>
            </header>


            {/* ===== ADMIN VIEW ===== */}
            {user?.role === "admin" && (
                <>
                    {/* Admin Stats */}
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

                    {/* Admin Table */}
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
                                {[
                                    { patient: "Rohan Mehta", doctor: "Dr. Sharma", department: "Cardiology", time: "10:00 AM" },
                                    { patient: "Sarah Khan", doctor: "Dr. Patel", department: "Neurology", time: "10:45 AM" },
                                    { patient: "Arjun Singh", doctor: "Dr. Verma", department: "Orthopedics", time: "11:20 AM" }
                                ].map((appointment, index) => (
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
                </>
            )}

            {/* ===== DOCTOR VIEW ===== */}
            {user?.role === "doctor" && (
                <>
                    {/* Doctor Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {doctorStats.map(stat => (
                            <Card key={stat.id} className="rounded-xl border p-5">
                                <CardContent>
                                    <p className="text-gray-500 text-sm">{stat.title}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Today's Patients */}
                    <div className="mt-10 bg-white rounded-2xl p-6 shadow-sm border">
                        <h2 className="text-lg font-semibold mb-4">Today's Patients</h2>

                        <ul className="flex flex-col gap-3">
                            {patients.map((d, idx) => (
                            <li
                                key={idx}
                                className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
                            >
                                <span>{d.name}</span>

                                <div className="flex items-center gap-3">
                                {/* <span className="font-medium">{d.time}</span> */}

                                {/* Refer Patient Modal */}
                                <ReferPatientModal userObj={d} />
                                </div>
                            </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}

            {/* ===== PATIENT VIEW ===== */}
            {user?.role === "patient" && (
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <h2 className="text-lg font-semibold mb-4">Today's Appointment</h2>

                    {patientAppointments.map((a, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                            <p><b>Doctor:</b> {a.doctor}</p>
                            <p><b>Department:</b> {a.department}</p>
                            <p><b>Time:</b> {a.time}</p>
                            <p><b>Status:</b> {a.status}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
