document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const sendButton = chatForm.querySelector("button");

  chatForm.addEventListener("submit", async (e) => {
    // 1. Prevent the default form submission which reloads the page
    e.preventDefault();

    const messageText = userInput.value.trim();
    if (!messageText) return;

    // Disable form and show loading state
    userInput.disabled = true;
    sendButton.disabled = true;
    sendButton.textContent = "...";

    addMessageToUI(messageText, "user-message");
    userInput.value = "";

    try {
      // 2. Call the fetch function to send the user's message to the backend
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await response.json();

      // 3. Handle potential errors from the server
      if (!response.ok) {
        throw new Error(
          data.reply || data.error || `HTTP error! Status: ${response.status}`
        );
      }

      // 4. Display the bot's successful reply
      addMessageToUI(data.reply, "bot-message");
    } catch (error) {
      // 5. Catch network errors or errors thrown from the try block
      console.error("Error during fetch:", error);
      addMessageToUI(
        error.message || "Failed to connect to the server.",
        "bot-message error"
      );
    } finally {
      // 6. Re-enable the form for the next message
      userInput.disabled = false;
      sendButton.disabled = false;
      sendButton.textContent = "Send";
      userInput.focus();
    }
  });

  function addMessageToUI(text, className) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", className);
    // Use innerHTML to properly render newlines from the AI as <br> tags
    messageElement.innerHTML = text.replace(/\n/g, "<br>");
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
  }
});
