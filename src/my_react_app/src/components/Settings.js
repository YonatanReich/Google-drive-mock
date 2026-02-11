import { useEffect, useState } from "react";
import '../styles/Settings.css';
import '../styles/global.css';

function Settings({ token, user }) {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const resSettings = await fetch(`http://localhost:3000/api/users/settings/${user.username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userSettings = await resSettings.json();
                console.log(userSettings);
                setForm({
                    firstName: userSettings.firstName || "",
                    lastName: userSettings.lastName || "",
                    email: userSettings.email || "",
                    phoneNumber: userSettings.phoneNumber || ""
                });
            } catch (err) {
                console.error("Failed to load user settings", err);
                alert("Failed to load settings");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`http://localhost:3000/api/users/newSettings/${user.username}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    firstName: form.firstName,
                    lastName: form.lastName,
                    phoneNumber: form.phoneNumber
                })
            });

            if (!res.ok) {
                throw new Error(`Error ${res.status}`);
            }

            alert("Settings saved!");
        } catch (err) {
            console.error("Failed to save settings", err);
            alert("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="settings-container">
            <form className="form" onSubmit={handleSubmit}>
                <h2 className="h2">Settings</h2>

                <div className="field">
                    <label className="label">First name:</label>
                    <input
                        className="input"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                    />
                </div>

                <div className="field">
                    <label className="label">Last name:</label>
                    <input
                        className="input"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                    />
                </div>

                <div className="field">
                    <label className="label">Phone number:</label>
                    <input
                        className="input"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                    />
                </div>

                <div className="field">
                    <label className="label">Email:</label>
                    <input
                        className="input"
                        value={form.email}
                        disabled
                    />
                </div>

                <button className="button" type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                </button>
            </form>
        </div>
    );
}

export default Settings;
