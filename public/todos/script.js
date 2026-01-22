const usernameSpan = document.getElementById("username");
const addTodoForm = document.getElementById("addTodoForm");
const noteInput = document.getElementById("noteInput");
const deadlineInput = document.getElementById("deadlineInput");
const tBody = document.getElementById("todoItems");

// --- 1. GARDA DEPAN: CEK LOGIN (WAJIB LOLOS SENSOR) ---
const checkAuth = async () => {
    try {
        // Tambahkan header untuk memastikan kita minta data terbaru
        const response = await fetch("/api/me", {
            method: "GET",
            credentials: "include",
            headers: { "Cache-Control": "no-cache" },
        });

        // Cek apakah responnya benar-benar Unauthorized (401)
        if (response.status === 401) {
            console.warn("Sesi habis atau belum login.");
            window.location.href = "/login/";
            return;
        }

        const result = await response.json();

        // Cek apakah data user benar-benar ada
        if (result.success && result.data && result.data.username) {
            fetchTodos();
        } else {
            // Jika login sukses tapi data kosong, mungkin sesi bermasalah
            window.location.href = "/login/";
        }
    } catch (error) {
        console.error("Gagal verifikasi login:", error);
        // Jangan langsung tendang jika hanya error jaringan, tunggu sebentar
    }
};

// --- 2. AMBIL DATA TUGAS ---
const fetchTodos = async () => {
    try {
        const response = await fetch("/api/todos", {
            credentials: "include",
        });
        const { success, data } = await response.json();

        if (success) {
            tBody.innerHTML = ""; // Bersihkan meja sebelum hidangan baru datang

            data.forEach((todo) => {
                const opsi = {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                };

                // Format Created Date
                const tglIn = todo.createAt
                    ? new Date(todo.createAt).toLocaleString("en-US", opsi)
                    : "-";

                // Format Finished Date (Kasih warna hijau kalau sudah beres)
                const tglOut = todo.completeAt
                    ? `<span class="completed-date">${new Date(
                        todo.completeAt
                    ).toLocaleString("en-US", opsi)}</span>`
                    : "-";

                // Format Deadline (Tampilkan '-' kalau kosong/null)
                const deadlineDate = todo.deadline
                    ? `<span class="deadline-badge">${new Date(
                        todo.deadline
                    ).toLocaleString("en-US", opsi)}</span>`
                    : "-";

                const isCompleted = todo.status === "completed";
                const tr = document.createElement("tr");

                tr.innerHTML = `
                        <td><input type="checkbox" id="check${todo.id}" ${isCompleted ? "checked" : ""
                    } /></td>
                        <td style="${isCompleted
                        ? "text-decoration: line-through; opacity: 0.5;"
                        : ""
                    }">
                            <span class="todo-note">${todo.note}</span>
                        </td>
                        <td>${deadlineDate}</td>
                        <td>
                            <div class="date-info">Created: ${tglIn}</div>
                            <div class="date-info">Finished: ${tglOut}</div>
                        </td>
                        <td><button class="btn-del" id="del${todo.id
                    }">Delete</button></td>
                    `;
                tBody.appendChild(tr);

                // --- EVENT: CHECKLIST (UBAH STATUS) ---
                document
                    .getElementById(`check${todo.id}`)
                    .addEventListener("change", async function () {
                        try {
                            await fetch(`/api/todos/${todo.id}/status`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    status: this.checked ? "completed" : "pending",
                                }),
                                credentials: "include",
                            });
                            fetchTodos(); // Refresh data biar warna & tanggal update
                        } catch (e) {
                            this.checked = !this.checked; // Kembalikan posisi kalau gagal
                        }
                    });

                // --- EVENT: DELETE (HAPUS TUGAS) ---
                document
                    .getElementById(`del${todo.id}`)
                    .addEventListener("click", async function () {
                        if (confirm("Are you sure you want to remove this task?")) {
                            try {
                                const res = await fetch(`/api/todos/${todo.id}`, {
                                    method: "DELETE",
                                    credentials: "include",
                                });
                                if (res.ok) fetchTodos();
                            } catch (e) {
                                console.error("Gagal menghapus:", e);
                            }
                        }
                    });
            });
        }
    } catch (error) {
        console.error("Gagal mengambil data:", error);
    }
};

// --- 3. TAMBAH TUGAS BARU ---
addTodoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Logic andalan: Jika input kosong, kirim null agar backend tidak error
    const deadlineValue = deadlineInput.value || null;

    try {
        const response = await fetch("/api/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                note: noteInput.value,
                deadline: deadlineValue,
            }),
            credentials: "include",
        });

        if (response.ok) {
            // Bersihkan form
            noteInput.value = "";
            deadlineInput.value = "";
            // Update tampilan
            fetchTodos();
        }
    } catch (error) {
        console.error("Gagal mengirim tugas baru:", error);
    }
});

// JALANKAN PROSES: DIMULAI DARI CEK LOGIN
checkAuth();
