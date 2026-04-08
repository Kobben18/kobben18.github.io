const productsContainer = document.getElementById("products");
const orderForm = document.getElementById("orderForm");
const selectedProductText = document.getElementById("selectedProduct");
const orderMessage = document.getElementById("orderMessage");


//fetch
if (productsContainer) {
  fetch("https://dummyjson.com/products")
    .then(res => res.json())
    .then(data => {
      data.products.forEach(product => {
        const card = document.createElement("a");
        card.classList.add("product-card");
        card.href = `product.html?id=${product.id}`;

        const img = document.createElement("img");
        img.src = product.thumbnail;
        card.appendChild(img);

        const title = document.createElement("h3");
        title.textContent = product.title;
        card.appendChild(title);

        const description = document.createElement("p");
        description.textContent = product.description;
        card.appendChild(description);

        const price = document.createElement("span");
        price.textContent = `$${product.price}`;
        card.appendChild(price);

        productsContainer.appendChild(card);
      });
    });
}

//form
if (orderForm) {

  //product text by ID
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (productId) {
    fetch(`https://dummyjson.com/products/${productId}`)
      .then(res => res.json())
      .then(product => {
        selectedProductText.textContent = `Product: ${product.title}`;
      })
      .catch(() => {
        selectedProductText.textContent = "Product: could not load product details";
      });
  } else {
    selectedProductText.textContent = "Product: none";
  }

  //validation
  const fieldConfigs = {
    name: {
      validate(value) {
        const trimmed = value.trim();
        if (trimmed.length < 2 || trimmed.length > 50) {
          return "Full name has to be between 2 and 50 characters.";
        }
        return "";
      }
    },
    email: {
      validate(value) {
        const trimmed = value.trim();
        if (trimmed.length > 50) {
          return "Email can be max 50 characters.";
        }
        if (!trimmed.includes("@")) {
          return "Email has to contain @.";
        }
        return "";
      }
    },
    phone: {
      validate(value) {
        const trimmed = value.trim();
        if (trimmed.length > 20) {
          return "Phone number can be max 20 characters.";
        }
        if (!/^[0-9]*$/.test(trimmed)) {
          return "Phone number may only contain numbers.";
        }
        return "";
      }
    },
    address: {
      validate(value) {
        const trimmed = value.trim();
        if (trimmed.length < 2 || trimmed.length > 50) {
          return "Street address has to be between 2 and 50 characters.";
        }
        return "";
      }
    },
    postalCode: {
      validate(value) {
        const trimmed = value.trim();
        if (!/^\d{5}$/.test(trimmed)) {
          return "Postal code has to consist of exactly 5 digits.";
        }
        return "";
      }
    },
    city: {
      validate(value) {
        const trimmed = value.trim();
        if (trimmed.length < 2 || trimmed.length > 20) {
          return "City has to be between 2 and 20 characters.";
        }
        return "";
      }
    }
  };

  function getFieldElement(fieldName) {
    return orderForm.elements[fieldName];
  }

  //add an error element if it doesn't exist yet, do nothing if one is already being displayed
  function ensureErrorElement(fieldName) {
    let errorEl = orderForm.querySelector(`[data-error-for="${fieldName}"]`);

    if (!errorEl) {
      const input = getFieldElement(fieldName);
      const label = input.closest("label");

      errorEl = document.createElement("small");
      errorEl.className = "field-error";
      errorEl.dataset.errorFor = fieldName;
      errorEl.style.display = "block";
      errorEl.style.marginTop = "6px";
      errorEl.style.fontSize = "0.9rem";
      errorEl.style.color = "#d10000";

      label.appendChild(errorEl);
    }

    return errorEl;
  }

  //adds text into error element
  function setFieldState(fieldName, message) {
    const errorEl = ensureErrorElement(fieldName);
    errorEl.textContent = message;
  }

  //function to validate a field
  function validateField(fieldName) {
    const input = getFieldElement(fieldName);
    const message = fieldConfigs[fieldName].validate(input.value);
    setFieldState(fieldName, message);
    return !message;
  }

  //loops through all fields and validates
  function validateForm() {
    let isValid = true;

    Object.keys(fieldConfigs).forEach(fieldName => {
      const fieldIsValid = validateField(fieldName);
      if (!fieldIsValid) {
        isValid = false;
      }
    });

    return isValid;
  }

  //runs when submit is pressed
  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    //stops if errors are still present
    if (!validateForm()) {
      return;
    }

    //removing stuff to show order is confirmed
    const heading = document.querySelector(".order h2");
    if (heading) heading.remove();

    orderForm.remove();
    selectedProductText.remove();
    orderMessage.textContent = "Order confirmed, thank you for ordering!";
  });
}