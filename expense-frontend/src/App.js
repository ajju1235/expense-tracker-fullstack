import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./App.css";
import { Pie, Bar } from "react-chartjs-2";
import Login from "./Login";
import Register from "./Register";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function App() {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [showRegister, setShowRegister] = useState(false);

  const [expenses, setExpenses] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const [editId, setEditId] = useState(null);

  // SEARCH
  const [search, setSearch] = useState("");

  // CATEGORY FILTER
  const [selectedCategory, setSelectedCategory] = useState("All");

  // DATE FILTER
  const [dateFilter, setDateFilter] = useState("All");

  // 🌙 DARK MODE
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [showProfile, setShowProfile] = useState(false);

  const token = localStorage.getItem("token");

 const [budget, setBudget] = useState(
   Number(localStorage.getItem("budget")) || 100000
 );

 const [categoryBudget, setCategoryBudget] = useState({
     Food: 5000,
     Fuel: 7000,
     Shopping: 3000,
     Shoes: 10000,
     Travel: 15000,
     Bills: 8000,
     Entertainment: 5000,
     Toy: 4000,
 });

 useEffect(() => {
   localStorage.setItem("budget", budget);
 }, [budget]);

  // SESSION EXPIRE
  const handleSessionExpired = () => {

    alert("Session expired. Please login again.");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  useEffect(() => {

    if (user && token) {
      fetchExpenses();
    }

  }, [user]);

  // 🌙 SAVE THEME
  useEffect(() => {

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );

  }, [darkMode]);

  // FETCH
  const fetchExpenses = () => {

    axios.get(
      "http://localhost:8080/expenses",
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    )

      .then(res => {

        setExpenses(res.data);

      })

      .catch(err => {

        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {

          handleSessionExpired();
          return;
        }

        console.log(err);
      });
  };

  // ADD + UPDATE
  const addExpense = () => {

    if (!title || !amount || !category) {

      alert("Fill all fields ❌");
      return;
    }

    const newExpense = {
      title,
      amount,
      category
    };

    // UPDATE
    if (editId) {

      axios.put(
        `http://localhost:8080/expenses/${editId}`,
        newExpense,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        }
      )

        .then(() => {

          fetchExpenses();
          resetForm();

        })

        .catch(err => {

          if (
            err.response?.status === 401 ||
            err.response?.status === 403
          ) {

            handleSessionExpired();
            return;
          }

          console.log(err);
        });

    } else {

      // ADD
      axios.post(
        "http://localhost:8080/expenses",
        newExpense,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        }
      )

        .then(() => {

          fetchExpenses();
          resetForm();

        })

        .catch(err => {

          if (
            err.response?.status === 401 ||
            err.response?.status === 403
          ) {

            handleSessionExpired();
            return;
          }

          console.log(err);
        });
    }
  };

  // RESET
  const resetForm = () => {

    setTitle("");
    setAmount("");
    setCategory("");

    setEditId(null);
  };

  // DELETE
  const deleteExpense = (id) => {

    axios.delete(
      `http://localhost:8080/expenses/${id}`,
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    )

      .then(() => {

        fetchExpenses();

      })

      .catch(err => {

        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {

          handleSessionExpired();
          return;
        }

        console.log(err);
      });
  };

  // 🔥 DOWNLOAD PDF REPORT

 const downloadPDF = () => {

 console.log("Current User:", user);

console.table(expenses);

const doc = new jsPDF("p", "mm", "a4");

   // ===========================
   // COLORS
   // ===========================
   const primary = [41, 98, 255];
   const secondary = [33, 150, 243];
   const dark = [40, 40, 40];
   const light = [245, 247, 250];
   const success = [46, 125, 50];

   // ===========================
   // PAGE SIZE
   // ===========================
   const pageWidth = doc.internal.pageSize.getWidth();
   const pageHeight = doc.internal.pageSize.getHeight();

   // ===========================
   // HEADER BACKGROUND
   // ===========================
   doc.setFillColor(...primary);
   doc.rect(0, 0, pageWidth, 30, "F");

   // Title
   doc.setFont("helvetica", "bold");
   doc.setFontSize(22);
   doc.setTextColor(255, 255, 255);
   doc.text("Expense Report", pageWidth / 2, 18, {
     align: "center",
   });

   // Subtitle
   doc.setFont("helvetica", "normal");
   doc.setFontSize(10);
   doc.text("Personal Expense Tracker", pageWidth / 2, 25, {
     align: "center",
   });

   // ===========================
   // REPORT INFO BOX
   // ===========================
   doc.setFillColor(...light);
   doc.roundedRect(12, 38, 186, 34, 3, 3, "F");

   doc.setTextColor(...dark);
   doc.setFont("helvetica", "bold");
   doc.setFontSize(12);

   doc.text(
     `User : ${user?.username ?? "Guest User"}`,
     18,
     48
   );

   doc.setFont("helvetica", "normal");
   doc.setFontSize(10);

   const today = new Date().toLocaleString();

   doc.text(`Generated On : ${today}`, 18, 56);

   doc.text(
     `Total Transactions : ${expenses.length}`,
     18,
     64
   );

   // ===========================
   // CALCULATIONS
   // ===========================

   const totalExpense = expenses.reduce(
     (sum, expense) => sum + Number(expense.amount),
     0
   );

   const highestExpense =
     expenses.length > 0
       ? Math.max(
           ...expenses.map((e) => Number(e.amount))
         )
       : 0;

   const averageExpense =
     expenses.length > 0
       ? totalExpense / expenses.length
       : 0;

   const categoryTotals = {};

   expenses.forEach((expense) => {
     categoryTotals[expense.category] =
       (categoryTotals[expense.category] || 0) +
       Number(expense.amount);
   });

   const topCategory =
     Object.keys(categoryTotals).length > 0
       ? Object.keys(categoryTotals).reduce((a, b) =>
           categoryTotals[a] > categoryTotals[b]
             ? a
             : b
         )
       : "N/A";
   // ===========================
   // SUMMARY SECTION
   // ===========================

   let y = 84;

   doc.setFont("helvetica", "bold");
   doc.setFontSize(14);
   doc.setTextColor(...primary);
   doc.text("Expense Summary", 14, y);

   y += 6;

   const cardWidth = 86;
   const cardHeight = 18;

   // Card 1
   doc.setFillColor(232, 245, 233);
   doc.roundedRect(14, y, cardWidth, cardHeight, 3, 3, "F");

   doc.setFont("helvetica", "bold");
   doc.setFontSize(11);
   doc.setTextColor(...success);
   doc.text("Total Expense", 18, y + 7);

   doc.setFont("helvetica", "normal");
   doc.setFontSize(10);
   doc.setTextColor(...dark);
   doc.text(`Rs. ${totalExpense.toFixed(2)}`, 18, y + 14);

   // Card 2
   doc.setFillColor(232, 240, 254);
   doc.roundedRect(110, y, cardWidth, cardHeight, 3, 3, "F");

   doc.setFont("helvetica", "bold");
   doc.setFontSize(11);
   doc.setTextColor(...primary);
   doc.text("Highest Expense", 114, y + 7);

   doc.setFont("helvetica", "normal");
   doc.setFontSize(10);
   doc.setTextColor(...dark);
   doc.text(`Rs. ${highestExpense.toFixed(2)}`, 114, y + 14);

   y += 26;

   // Card 3
   doc.setFillColor(255, 248, 225);
   doc.roundedRect(14, y, cardWidth, cardHeight, 3, 3, "F");

   doc.setFont("helvetica", "bold");
   doc.setFontSize(11);
   doc.setTextColor(255, 143, 0);
   doc.text("Average Expense", 18, y + 7);

   doc.setFont("helvetica", "normal");
   doc.setFontSize(10);
   doc.setTextColor(...dark);
   doc.text(`Rs. ${averageExpense.toFixed(2)}`, 18, y + 14);

   // Card 4
   doc.setFillColor(243, 229, 245);
   doc.roundedRect(110, y, cardWidth, cardHeight, 3, 3, "F");

   doc.setFont("helvetica", "bold");
   doc.setFontSize(11);
   doc.setTextColor(123, 31, 162);
   doc.text("Top Category", 114, y + 7);

   doc.setFont("helvetica", "normal");
   doc.setFontSize(10);
   doc.setTextColor(...dark);
   doc.text(topCategory, 114, y + 14);

   y += 30;

   // ===========================
   // TRANSACTION TABLE
   // ===========================

   doc.setFont("helvetica", "bold");
   doc.setFontSize(14);
   doc.setTextColor(...primary);
   doc.text("Transaction Details", 14, y);

   y += 6;

   autoTable(doc, {
     startY: y,

     head: [[
       "Date",
       "Title",
       "Category",
       "Amount (Rs.)"
     ]],

    body: expenses.map((expense) => [
      new Date(expense.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      expense.title,
      expense.category,
      Number(expense.amount).toFixed(2),
    ]),

     theme: "grid",

     headStyles: {
       fillColor: primary,
       textColor: [255, 255, 255],
       fontStyle: "bold",
       halign: "center",
       fontSize: 10,
     },

     bodyStyles: {
       fontSize: 9,
       valign: "middle",
       textColor: [60, 60, 60],
     },

     alternateRowStyles: {
       fillColor: [248, 249, 250],
     },

     styles: {
       cellPadding: 3,
       overflow: "linebreak",
       lineColor: [220, 220, 220],
       lineWidth: 0.2,
     },
     columnStyles: {
       0: { cellWidth: 32 },
       1: { cellWidth: 60 },
       2: { cellWidth: 50 },
       3: { halign: "right", cellWidth: 38 },
     },

     didDrawPage: function (data) {

       // Footer Line
       doc.setDrawColor(...primary);
       doc.line(
         14,
         pageHeight - 18,
         pageWidth - 14,
         pageHeight - 18
       );

       // Footer Left
       doc.setFont("helvetica", "normal");
       doc.setFontSize(9);
       doc.setTextColor(120);

       doc.text(
         "Generated by Expense Tracker",
         14,
         pageHeight - 10
       );

       // Footer Right
       doc.text(
         "Page " + doc.internal.getNumberOfPages(),
         pageWidth - 14,
         pageHeight - 10,
         { align: "right" }
       );
     },
   });

   // ===========================
   // THANK YOU MESSAGE
   // ===========================

   let finalY = doc.lastAutoTable.finalY + 18;

   if (finalY > pageHeight - 45) {
     doc.addPage();
     finalY = 25;

     doc.setDrawColor(...secondary);
     doc.line(
       14,
       finalY - 6,
       pageWidth - 14,
       finalY - 6
     );

     doc.setFont("helvetica", "bold");
     doc.setFontSize(12);
     doc.setTextColor(...primary);

     doc.text(
       "Financial Summary",
       14,
       finalY + 2
     );

     doc.setFont("helvetica", "normal");
     doc.setFontSize(10);
     doc.setTextColor(...dark);

     doc.text(
       `This report contains ${expenses.length} recorded transaction(s).`,
       14,
       finalY + 10
     );

     doc.text(
       `Total amount spent: Rs. ${totalExpense.toFixed(2)}`,
       14,
       finalY + 18
     );

     doc.text(
       `Top spending category: ${topCategory}`,
       14,
       finalY + 26
     );

     doc.setFont("helvetica", "italic");
     doc.setTextColor(100);

     doc.text(
       "Thank you for using Expense Tracker.",
       pageWidth / 2,
       finalY + 40,
       { align: "center" }
     );
   }

   // ===========================
   // SAVE PDF
   // ===========================

   doc.save(
     `Expense_Report_${user.name}.pdf`
   );
 };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
  };

  const currentUser =
    JSON.parse(localStorage.getItem("user")) || {};

  const handlePasswordChange = async () => {

    try {

      const username =
        JSON.parse(localStorage.getItem("user"))?.username;

      const response = await axios.post(
        "http://localhost:8080/api/auth/change-password",
        {
          username,
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        }
      );

      alert(response.data.message);

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      setUser(null);

      alert("Please login again with your new password 🔐");

      setPasswordData({
        oldPassword: "",
        newPassword: ""
      });

      setShowPasswordModal(false);

    } catch (error) {

      alert(
        error.response?.data?.message ||
        error.message
      );
    }
  };

  // FILTERED EXPENSES
  const filteredExpenses = expenses.filter(exp => {

    // SEARCH
    const matchesSearch =
      exp.title.toLowerCase()
        .includes(search.toLowerCase());

    // CATEGORY
    const matchesCategory =
      selectedCategory === "All"
        ? true
        : exp.category === selectedCategory;

    // DATE FILTER
    let matchesDate = true;

    if (dateFilter === "Today") {

      const today = new Date();

      const expenseDate = new Date(
        exp.createdAt || exp.date
      );

      matchesDate =
        expenseDate.toDateString() ===
        today.toDateString();
    }

    if (dateFilter === "Month") {

      const today = new Date();

      const expenseDate = new Date(
        exp.createdAt || exp.date
      );

      matchesDate =
        expenseDate.getMonth() === today.getMonth()
        &&
        expenseDate.getFullYear() === today.getFullYear();
    }

    return (
      matchesSearch
      &&
      matchesCategory
      &&
      matchesDate
    );
  });

  // TOTAL
  const totalAmount = filteredExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  const remainingBudget = budget - totalAmount;

  const budgetPercentage =
    budget > 0
      ? Math.min((totalAmount / budget) * 100, 100)
      : 0;

      const isBudgetExceeded = totalAmount > budget;

  // CATEGORY TOTALS
  const categoryTotals = {};

  filteredExpenses.forEach((exp) => {

    categoryTotals[exp.category] =
      (categoryTotals[exp.category] || 0)
      + Number(exp.amount);

  });

  const exceededCategories = [];

  Object.keys(categoryBudget).forEach((category) => {

    const spent = categoryTotals[category] || 0;
    const limit = categoryBudget[category];

    if (spent > limit) {
      exceededCategories.push({
        category,
        spent,
        limit,
      });
    }

  });

  // HIGHEST CATEGORY
  const highestCategory =
    Object.keys(categoryTotals).length > 0
      ? Object.keys(categoryTotals).reduce((a, b) =>
          categoryTotals[a] > categoryTotals[b]
            ? a
            : b
        )
      : "None";

  // HIGHEST EXPENSE
  const highestExpense =
    filteredExpenses.length > 0
      ? Math.max(
          ...filteredExpenses.map(
            (e) => Number(e.amount)
          )
        )
      : 0;

  // TOTAL TRANSACTIONS
  const totalTransactions =
    filteredExpenses.length;



  // THIS MONTH EXPENSE
  const thisMonthExpense =
    filteredExpenses
      .filter((exp) => {

        const expenseDate = new Date(
          exp.createdAt || exp.date
        );

        const today = new Date();

        return (
          expenseDate.getMonth() ===
            today.getMonth()
          &&
          expenseDate.getFullYear() ===
            today.getFullYear()
        );
      })

      .reduce(
        (total, exp) =>
          total + Number(exp.amount),
        0
      );

  // 🔥 AVERAGE TRANSACTION
  const averageTransaction =
    totalTransactions > 0
      ? Math.round(totalAmount / totalTransactions)
      : 0;

  // 🔥 SMART MESSAGE
  const smartMessage = `
⚠️ ${highestCategory} spending is highest this month
`;

  // PIE CHART DATA
  const categoryData = {};

  filteredExpenses.forEach(exp => {

    categoryData[exp.category] =
      (categoryData[exp.category] || 0)
      + Number(exp.amount);

  });

  const chartData = {

    labels: Object.keys(categoryData),

    datasets: [
      {
        data: Object.values(categoryData),

        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#8E44AD",
          "#E67E22"
        ]
      }
    ]
  };

  // MONTHLY ANALYTICS
  const monthlyData = {};

  filteredExpenses.forEach(exp => {

    const date = new Date(
      exp.createdAt || exp.date
    );

    const month =
      date.toLocaleString("default", {
        month: "short"
      });

    monthlyData[month] =
      (monthlyData[month] || 0)
      + Number(exp.amount);

  });

  const barData = {

    labels: Object.keys(monthlyData),

    datasets: [
      {
        label: "Monthly Expenses",

        data: Object.values(monthlyData),

        backgroundColor: "#6C63FF",

        borderRadius: 10
      }
    ]
  };

  // UNIQUE CATEGORIES
  const categories = [
    "All",
    ...new Set(expenses.map(exp => exp.category))
  ];

  // LOGIN / REGISTER
  if (!user) {

    return showRegister ? (

      <Register
        onSwitch={() => setShowRegister(false)}
      />

    ) : (

      <Login
        onLogin={setUser}
        onSwitch={() => setShowRegister(true)}
      />

    );
  }

  return (

    <div
      className={
        darkMode
          ? "container mt-5 dark-mode"
          : "container mt-5 light-mode"
      }
    >

      <h1 className="text-center mb-4">
        Expense Tracker 💸
      </h1>

      {/* TOP */}

     <div className="top-header d-flex justify-content-between align-items-center mb-3">

       <div className="d-flex align-items-center gap-2">

         <button
           className="btn btn-secondary"
           onClick={() => setDarkMode(!darkMode)}
         >
           {darkMode ? "☀️ Light" : "🌙 Dark"}
         </button>

         <h4 className="mb-0">
           Welcome {user.username} 👋
         </h4>

       </div>

       <div className="header-buttons">

         <button
           className="btn btn-success me-2"
           onClick={downloadPDF}
         >
           📄 Download Report
         </button>

         <button
           className="btn btn-info me-2"
           onClick={() => setShowProfile(true)}
         >
           👤 Profile
         </button>

         <button
           className="btn btn-warning me-2"
           onClick={() => setShowPasswordModal(true)}
         >
           🔐 Change Password
         </button>

         <button
           className="btn btn-danger"
           onClick={logout}
         >
           Logout
         </button>

       </div>

     </div>

      {/* TOTAL */}

      <div className="card total-card p-4 mb-4 text-center shadow">

        <h5>Total Expense</h5>

        <h2 className="text-success">
          ₹{totalAmount}
        </h2>

      </div>

      {/* ANALYTICS CARDS */}

      <div className="analytics-grid">

        <div className="analytics-card">

          <h4>💰 Total Expense</h4>

          <h2>
            ₹{totalAmount}
          </h2>

        </div>

        <div className="analytics-card">

          <h4>📈 Highest Expense</h4>

          <h2>
            ₹{highestExpense}
          </h2>

        </div>

        <div className="analytics-card">

          <h4>📊 Transactions</h4>

          <h2>
            {totalTransactions}
          </h2>

        </div>

        <div className="analytics-card">

          <h4>📅 This Month</h4>

          <h2>
            ₹{thisMonthExpense}
          </h2>

        </div>

      </div>

      <div className="card p-3 mb-4 shadow">

        <h4>🎯 Monthly Budget Tracker</h4>

        <input
          type="number"
          className="form-control mb-3"
          value={budget}
          onChange={(e) => {
            setBudget(Number(e.target.value));
            localStorage.setItem(
              "budget",
              Number(e.target.value)
            );
          }}
          placeholder="Set Budget"
        />

        <p>
          <strong>Budget:</strong> ₹{budget}
        </p>

        <p>
          <strong>Spent:</strong> ₹{totalAmount}
        </p>

        <p>
          <strong>Remaining:</strong> ₹{remainingBudget}
        </p>

        {isBudgetExceeded && (
          <div className="alert alert-danger mt-3">
            🚨 Budget Exceeded by ₹{Math.abs(remainingBudget)}
          </div>
        )}

        <div className="progress">

          <div
            className={`progress-bar ${
              isBudgetExceeded
                ? "bg-danger"
                : "bg-success"
            }`}
            role="progressbar"
            style={{
              width: `${budgetPercentage}%`
            }}
          >
            {budgetPercentage.toFixed(0)}%
          </div>

        </div>

      </div>

      {exceededCategories.length > 0 && (

        <div
          style={{
            background: "#2b1f1f",
            border: "1px solid red",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >

          <h3 style={{ color: "#ff6b6b" }}>
            ⚠ Category Budget Alerts
          </h3>

          {exceededCategories.map((item, index) => (

            <div key={index} style={{ marginTop: "10px" }}>

              <strong>{item.category}</strong>

              <br />

              Spent: ₹{item.spent}

              <br />

              Limit: ₹{item.limit}

            </div>

          ))}

        </div>

      )}

      {/* 🔥 AI SMART INSIGHTS */}

      <div className="smart-insights-box">

        <h3 className="mb-4">
          🧠 Smart Spending Insights
        </h3>

        <div className="smart-message">
          {smartMessage}
        </div>

        <div className="smart-grid">

          <div className="smart-card">

            <h5>📈 Highest Expense</h5>

            <p>₹{highestExpense}</p>

          </div>

          <div className="smart-card">

            <h5>💡 Monthly Spending</h5>

            <p>₹{thisMonthExpense}</p>

          </div>

          <div className="smart-card">

            <h5>🧾 Average Transaction</h5>

            <p>₹{averageTransaction}</p>

          </div>

          <div className="smart-card">

            <h5>🔥 Top Category</h5>

            <p>{highestCategory}</p>

          </div>

        </div>

      </div>

      {/* FILTERS */}

      <div className="card p-3 mb-4 shadow">

        <div className="row">

          <div className="col-md-4 mb-2">

            <input
              className="form-control"
              placeholder="🔍 Search expense..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="col-md-4 mb-2">

            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value)
              }
            >

              {categories.map((cat, index) => (

                <option key={index}>
                  {cat}
                </option>

              ))}

            </select>

          </div>

          <div className="col-md-4 mb-2">

            <select
              className="form-select"
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(e.target.value)
              }
            >

              <option>All</option>
              <option>Today</option>
              <option>Month</option>

            </select>

          </div>

        </div>

      </div>

      {/* FORM */}

      <div className="card p-3 mb-4 shadow">

        <div className="row">

          <div className="col-md-3 mb-2">

            <input
              className="form-control"
              placeholder="Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

          </div>

          <div className="col-md-3 mb-2">

            <input
              className="form-control"
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
            />

          </div>

          <div className="col-md-3 mb-2">

            <input
              className="form-control"
              placeholder="Category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            />

          </div>

          <div className="col-md-3 mb-2">

            <button
              className="btn btn-primary w-100"
              onClick={addExpense}
            >
              {editId ? "Update" : "Add"}
            </button>

          </div>

        </div>

      </div>

      {/* PIE CHART */}

     <div className="card p-4 shadow mb-4 chart-container">

        <Pie data={chartData} />

      </div>

      {/* BAR CHART */}

      <div className="card p-4 shadow mb-4">

        <h4 className="text-center mb-4">
          Monthly Analytics 📊
        </h4>

        <Bar data={barData} />

      </div>

      {/* LIST */}

      <ul className="list-group mt-4">

        {filteredExpenses.map(exp => (

          <li
            key={exp.id}
            className="list-group-item expense-item d-flex justify-content-between align-items-center"
          >

            <div>

              <strong>{exp.title}</strong>

              {" "} - ₹{exp.amount}

              <span className="text-muted">
                {" "}({exp.category})
              </span>

              <br />

              <small className="text-info">

                📅 {
                  exp.createdAt || exp.date
                    ?
                    new Date(
                      exp.createdAt || exp.date
                    ).toLocaleString()
                    :
                    "No Date"
                }

              </small>

            </div>

            <div>

              <button
                className="btn btn-warning btn-sm me-2"

                onClick={() => {

                  setEditId(exp.id);

                  setTitle(exp.title);

                  setAmount(exp.amount);

                  setCategory(exp.category);

                }}
              >
                ✏️
              </button>

              <button
                className="btn btn-danger btn-sm"

                onClick={() =>
                  deleteExpense(exp.id)
                }
              >
                ❌
              </button>

            </div>

          </li>

        ))}

      </ul>

      {showPasswordModal && (

        <div className="modal-overlay">

          <div className="password-modal">

            <h4>🔐 Change Password</h4>

            <input
              type="password"
              className="form-control mb-2"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  oldPassword: e.target.value
                })
              }
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value
                })
              }
            />

            <button
              className="btn btn-success me-2"
              onClick={handlePasswordChange}
            >
              Save
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      {showProfile && (
        <div className="modal d-block">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="fw-bold text-primary">
                  👤 My Profile
                </h5>
              </div>

              <div className="modal-body">

              <div className="text-center mb-3">

                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "#6C63FF",
                    color: "white",
                    fontSize: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "auto"
                  }}
                >
                  {currentUser.username?.charAt(0).toUpperCase()}
                </div>

              </div>

                <p>
                  <strong>Username:</strong> {currentUser.username}
                </p>

                <p>
                  <strong>Total Expense:</strong> ₹{totalAmount}
                </p>

                <p>
                  <strong>Total Transactions:</strong> {expenses.length}
                </p>

                <p>
                  <strong>Highest Expense:</strong> ₹{highestExpense}
                </p>

                <p>
                  <strong>Top Category:</strong> {highestCategory}
                </p>

              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  onClick={() => setShowProfile(false)}
                >
                  Close
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>


  );
}

export default App;