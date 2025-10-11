 document.addEventListener("DOMContentLoaded", function () {
        const container = document.querySelector(".websitecontainer");

        let scrollStep = 2;   // speed (px per tick)
        let scrollInterval = 20; // in ms
        let direction = 1;    // 1 = right, -1 = left
        let autoScrollTimer;

        function autoScroll() {
        // Bounce logic
        if (direction === 1 && container.scrollLeft + container.clientWidth >= container.scrollWidth) {
            direction = -1; // reached end then go left
        } else if (direction === -1 && container.scrollLeft <= 0) {
            direction = 1;  // reached start then go right
        }
        container.scrollLeft += scrollStep * direction;
        }

        // start scrolling
        autoScrollTimer = setInterval(autoScroll, scrollInterval);

        //Pause when user hovers (for interaction)
        container.addEventListener("mouseenter", () => clearInterval(autoScrollTimer));
        container.addEventListener("mouseleave", () => {
        autoScrollTimer = setInterval(autoScroll, scrollInterval);
        });
    });