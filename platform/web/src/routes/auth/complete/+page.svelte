<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { completeMagicLink, storeSession } from "$lib/auth-client";

  let status = "Completing your sign-in link...";
  let error = "";

  onMount(() => {
    void (async () => {
      try {
        const token = new URL(window.location.href).searchParams.get("token");

        if (!token) {
          throw new Error("Missing sign-in token");
        }

        const session = await completeMagicLink(token);
        storeSession(session);
        await goto("/", { replaceState: true });
      } catch (caughtError) {
        error =
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to complete sign-in";
        status = "Could not complete sign-in.";
      }
    })();
  });
</script>

<svelte:head>
  <title>Completing sign in - civiq</title>
</svelte:head>

<section class="shell">
  <div class="hero">
    <p class="eyebrow">civiq</p>
    <h1>{status}</h1>
    {#if error}
      <p class="lede error">{error}</p>
    {/if}
  </div>
</section>
