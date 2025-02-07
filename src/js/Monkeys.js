const filterButtons = document.querySelectorAll(".filter-bar button");
const cards = document.querySelectorAll(".card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.getAttribute("data-filter");

        // Filter cards
        cards.forEach(card => {
            if (filter === "all" || card.classList.contains(filter)) {
                card.style.opacity = "1";
                setTimeout(() => card.classList.remove("hidden"), 200);
            } else {
                card.style.opacity = "0";
                setTimeout(() => card.classList.add("hidden"), 200);
            }
        });
    });
});
