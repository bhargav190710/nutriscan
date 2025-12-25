const APP_ID = "9177cc1c"; 
const APP_KEY = "9f153da4b14fc9ebdbbe7ff9c3d5e699"; 

document.getElementById('searchBtn').addEventListener('click', () => {
    const foodName = document.getElementById('foodInput').value;
    if (foodName) {
        searchFood(foodName);
    }
});

async function searchFood(query) {
    const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${APP_ID}&app_key=${APP_KEY}&ingr=${encodeURIComponent(query)}&nutrition-type=logging`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.hints && data.hints.length > 0) {
            const food = data.hints[0].food;
            const nutrients = food.nutrients;
            const cals = Math.round(nutrients.ENERC_KCAL);

            // Update Main UI
            document.getElementById('foodName').innerText = food.label;
            document.getElementById('calories').innerText = cals + " kcal";

            updateMacros(
                Math.round(nutrients.PROCNT || 0),
                Math.round(nutrients.CHOCDF || 0),
                Math.round(nutrients.FAT || 0)
            );

            // NEW: Add to history list
            addToHistory(food.label, cals);

        } else {
            alert("No food found!");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// 1. Load history as soon as the page opens
window.onload = () => {
    loadHistory();
};

async function searchFood(query) {
    const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${APP_ID}&app_key=${APP_KEY}&ingr=${encodeURIComponent(query)}&nutrition-type=logging`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.hints && data.hints.length > 0) {
            const food = data.hints[0].food;
            const nutrients = food.nutrients;
            const cals = Math.round(nutrients.ENERC_KCAL);

            // Update UI
            document.getElementById('foodName').innerText = food.label;
            document.getElementById('calories').innerText = cals + " kcal";

            updateMacros(
                Math.round(nutrients.PROCNT || 0),
                Math.round(nutrients.CHOCDF || 0),
                Math.round(nutrients.FAT || 0)
            );

            // Save to History and LocalStorage
            saveToLocalStorage(food.label, cals);

        } else {
            alert("No food found!");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// 2. Function to save data to the browser's memory
function saveToLocalStorage(name, kcal) {
    let history = JSON.parse(localStorage.getItem('foodHistory')) || [];
    
    // Add new item to the beginning of the array
    history.unshift({ name, kcal });

    // Keep only the last 10 items so the list doesn't get too long
    if (history.length > 10) history.pop();

    localStorage.setItem('foodHistory', JSON.stringify(history));
    
    // Refresh the visual list
    loadHistory();
}

// 3. Function to display items from memory onto the screen
function loadHistory() {
    const historyList = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem('foodHistory')) || [];
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-msg">No items searched yet.</p>';
        return;
    }

    historyList.innerHTML = ''; // Clear current list
    history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<strong>${item.name}</strong>: ${item.kcal} kcal`;
        historyList.appendChild(div);
    });
}

function updateMacros(p, c, f) {
    const values = document.querySelectorAll('.macro-item .value');
    values[0].innerText = p + "g";
    values[1].innerText = c + "g";
    values[2].innerText = f + "g";

    // Set bars based on a 50g reference for visual scale
    document.querySelector('.bar-fill.protein').style.width = Math.min((p / 50) * 100, 100) + "%";
    document.querySelector('.bar-fill.carbs').style.width = Math.min((c / 50) * 100, 100) + "%";
    document.querySelector('.bar-fill.fats').style.width = Math.min((f / 50) * 100, 100) + "%";
    async function searchFood(query) {
    const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${APP_ID}&app_key=${APP_KEY}&ingr=${encodeURIComponent(query)}&nutrition-type=logging`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.hints && data.hints.length > 0) {
            const food = data.hints[0].food;
            const nutrients = food.nutrients;
            const cals = Math.round(nutrients.ENERC_KCAL);

            // Update Main UI
            document.getElementById('foodName').innerText = food.label;
            document.getElementById('calories').innerText = cals + " kcal";

            updateMacros(
                Math.round(nutrients.PROCNT || 0),
                Math.round(nutrients.CHOCDF || 0),
                Math.round(nutrients.FAT || 0)
            );

            // NEW: Add to history list
            addToHistory(food.label, cals);

        } else {
            alert("No food found!");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}


}
let baseNutrientsPer100g = null;

async function searchFood(query) {
    const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${APP_ID}&app_key=${APP_KEY}&ingr=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.hints && data.hints.length > 0) {
            const food = data.hints[0].food;
            
            // Edamam usually returns values per 100g in the 'nutrients' object
            baseNutrientsPer100g = {
                name: food.label,
                calories: food.nutrients.ENERC_KCAL, // kcal per 100g
                protein: food.nutrients.PROCNT || 0, // g per 100g
                carbs: food.nutrients.CHOCDF || 0,   // g per 100g
                fats: food.nutrients.FAT || 0        // g per 100g
            };

            // Set default weight to 100g on every new search
            document.getElementById('foodWeight').value = 100;
            updateByWeight(100);
        } else {
            alert("Food not found!");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Event listener for the weight input
document.getElementById('foodWeight').addEventListener('input', (e) => {
    const weight = parseFloat(e.target.value) || 0;
    updateByWeight(weight);
});

function updateByWeight(grams) {
    if (!baseNutrientsPer100g) return;

    // Calculation: (Value / 100) * grams
    const factor = grams / 100;

    const totalCals = Math.round(baseNutrientsPer100g.calories * factor);
    const totalP = (baseNutrientsPer100g.protein * factor).toFixed(1);
    const totalC = (baseNutrientsPer100g.carbs * factor).toFixed(1);
    const totalF = (baseNutrientsPer100g.fats * factor).toFixed(1);

    // Update UI
    document.getElementById('foodName').innerText = baseNutrientsPer100g.name;
    document.getElementById('calories').innerText = `${totalCals} kcal`;
    
    const values = document.querySelectorAll('.macro-item .value');
    values[0].innerText = `${totalP}g`;
    values[1].innerText = `${totalC}g`;
    values[2].innerText = `${totalF}g`;

    // Visual bars (Normalized to a max of 50g per macro for visual effect)
    document.querySelector('.bar-fill.protein').style.width = Math.min((totalP / 50) * 100, 100) + "%";
    document.querySelector('.bar-fill.carbs').style.width = Math.min((totalC / 50) * 100, 100) + "%";
    document.querySelector('.bar-fill.fats').style.width = Math.min((totalF / 50) * 100, 100) + "%";
}
// Get modal elements
const modal = document.getElementById("loginModal");
const loginBtn = document.querySelector(".btn-login"); // The button in your nav
const closeBtn = document.querySelector(".close-btn");

// Open modal on click
loginBtn.onclick = (e) => {
    e.preventDefault(); // Prevent page reload
    modal.style.display = "block";
}

// Close modal on click of (x)
closeBtn.onclick = () => {
    modal.style.display = "none";
}

// Close modal if user clicks outside of the white box
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Handle Form Submission
document.getElementById('loginForm').onsubmit = (e) => {
    e.preventDefault();
    alert("Login feature requires a backend. For now, this is a UI demo!");
    modal.style.display = "none";
};
const firebaseConfig = {
  apiKey: "AIzaSyAoegeZMo4gh0_xnK83jtpOOQ5hBnTqUes",
  authDomain: "",
  projectId: "nutriscan-10106",
  storageBucket: "nutriscan-10106.firebasestorage.app",
  messagingSenderId: "",
  appId: "1:82082764700:android:f1017ede3706c38bfb1a59"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Handle Login Form
document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        alert("Welcome back, " + user.email);
        modal.style.display = "none";
        
        // Update UI for Logged In User
        document.querySelector('.btn-login').innerText = "Logout";
    } catch (error) {
        alert("Error: " + error.message);
    }
};

// Handle Authentication State
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is signed in:", user.uid);
        // You can now save food logs to their specific account in a database!
    } else {
        console.log("No user signed in.");
    }
});
// --- Login Logic ---
document.getElementById('btnLogin').onclick = async (e) => {
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert("Login Successful!");
        document.getElementById('loginModal').style.display = 'none';
    } catch (error) {
        alert("Login Error: " + error.message);
    }
};

// --- Sign Up Logic (New) ---
document.getElementById('btnSignUp').onclick = async (e) => {
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        // This creates the user in your Firebase database
        await auth.createUserWithEmailAndPassword(email, password);
        alert("Account Created Successfully! You are now logged in.");
        document.getElementById('loginModal').style.display = 'none';
    } catch (error) {
        // This handles cases like 'Email already in use' or 'Password too weak'
        alert("Registration Error: " + error.message);
    }
};
// Replace your old login click handler with this:
document.getElementById('btnLogin').onclick = async (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert("Login Successful!");
        document.getElementById('loginModal').style.display = 'none';
    } catch (error) {
        // This will now show the real error from Firebase if it fails
        alert("Login Error: " + error.message);
    }
};