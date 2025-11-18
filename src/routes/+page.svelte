<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { marked } from 'marked';

  let page = {};
  let company = {};
  let lastUpdate = 0;

  async function load() {
    if (!browser) return; 

    const ts = Date.now();
    try {
      const [p, c] = await Promise.all([
        fetch(`/content/pages/home.json?t=${ts}`),
        fetch(`/content/company.json?t=${ts}`)
      ]);
      if (p.ok) page = await p.json();
      if (c.ok) company = await c.json();
    } catch (e) {
      console.error('Fetch failed:', e);
    }
    lastUpdate = Date.now();
  }

  // Only run in the browser
  onMount(() => {
    load();                    
    const interval = setInterval(load); 
    return () => clearInterval(interval);     
  });
</script>

<svelte:head>
  <title>{company.name || 'My Company'}</title>
</svelte:head>

<main style="padding: 4rem 2rem; font-family: system-ui; max-width: 1200px; margin: 0 auto;">
  {#if company.logo}
    <img src={company.logo} alt={company.name} style="height: 90px; margin-bottom: 2rem;" />
  {/if}

  <h1 style="font-size: 3.5rem; margin: 0.5rem 0;">{page.title || 'Welcome'}</h1>
  
  {#if company.tagline}
    <p style="font-size: 1.6rem; color: #444; margin-bottom: 3rem;">{company.tagline}</p>
  {/if}

  {#if page.hero}
    <img src={page.hero} alt="Hero" style="width: 100%; max-height: 600px; object-fit: cover; border-radius: 16px; margin: 2rem 0;" />
  {/if}

  <div style="font-size: 1.2rem; line-height: 1.8; max-width: 800px;">
    {@html marked(page.body || 'Edit this text in the CMS at /admin →')}
  </div>

  <footer style="margin-top: 5rem; color: #888; font-size: 0.9rem;">
    Last updated: {browser ? new Date(lastUpdate).toLocaleTimeString() : '...'}
  </footer>
</main>