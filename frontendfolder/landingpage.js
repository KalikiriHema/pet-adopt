/*const adoptForm = document.getElementById('adopt-form');
if (adoptForm) {
  adoptForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const petName = document.getElementById('pet-name').textContent || document.getElementById('petNameInput')?.value;
    const applicantName = document.getElementById('adopt-name').value;
    const applicantEmail = document.getElementById('adopt-email').value;
    const applicantPhone = document.getElementById('mobile').value;
    const message = document.getElementById('adopt-message') ? document.getElementById('adopt-message').value : '';
    const res = await fetch('http://localhost:5000/api/adopt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ petName, applicantName, applicantEmail, applicantPhone, message })
    });
    const json = await res.json();
    if (json.success) {
      alert('Adoption request sent — we will contact you!');
      adoptForm.reset();
      // close popup
    } else alert(json.error || 'Error');
  });
}*/

// Submit adoption form
const adoptForm = document.getElementById("adopt-form");
if (adoptForm) {
  adoptForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const petName = document.getElementById("pet-name").textContent;
    const name = document.querySelector("#adopt-form #name").value;
    const email = document.querySelector("#adopt-form #email").value;
    const mobile = document.querySelector("#adopt-form #mobile").value;

    const res = await fetch("http://localhost:5000/api/adoptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ petName, name, email, mobile }),
    });
    const data = await res.json();
    if (data.ok) {
      alert("Adoption request submitted. We’ll contact you soon!");
      adoptForm.reset();
      closeAdoptForm();
    } else {
      alert("Failed: " + (data.error || "Try again"));
    }
  });
}


