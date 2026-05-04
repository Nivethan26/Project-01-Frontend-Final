import { useState, useEffect } from "react";

export function useUserAuth() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Read from session first, then hydrate from backend session if available.
    const fetchUser = async () => {
      const cachedUsername = sessionStorage.getItem("username");
      if (cachedUsername) {
        setUsername(cachedUsername);
        return;
      }

      try {
        const response = await fetch("/Backend/getUser.php", {
          credentials: "include",
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const apiUsername = data?.user?.username || data?.username;

        if (apiUsername) {
          setUsername(apiUsername);
          sessionStorage.setItem("username", apiUsername);
        }
      } catch (_) {
        // Keep UI state from sessionStorage if API call fails.
      }
    };

    fetchUser();
  }, []);

  return { username };
}
