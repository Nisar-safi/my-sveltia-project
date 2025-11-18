<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { marked } from 'marked';
	

  let page = $state({});
  let company = $state({});
  let lastUpdate =$state(0);
  let mobileMenuOpen =$state(false);

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }

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
    const interval = setInterval(load, 30000); 
    return () => clearInterval(interval);     
  });
</script>

<svelte:head>
  <title>{company.name || 'My Company'}</title>
</svelte:head>

<header>
  <div class="container">
    <div class="header-content">
      <a href="/" class="logo">
        {#if company.logo}
          <img src={company.logo} alt={company.name} />
        {/if}
        {company.name || 'My Company'}
      </a>
      
      <button class="mobile-menu-btn" onclick={toggleMobileMenu}>
        ☰
      </button>
      
      <ul class="nav-menu {mobileMenuOpen ? 'open' : ''}">
        {#if page.navbar && page.navbar.links}
          {#each page.navbar.links as link}
            <li>
              <a 
                href={link.href} 
                class="nav-link {link.active ? 'active' : ''}"
                onclick={closeMobileMenu}
              >
                {link.text}
              </a>
            </li>
          {/each}
        {/if}
      </ul>
    </div>
  </div>
</header>

<main>
  <div class="container">
    <div class="hero-section">
      <h1>{page.title || 'Welcome'}</h1>
      
      {#if company.tagline}
        <p class="tagline">{company.tagline}</p>
      {/if}
      
      {#if page.hero}
        <img src={page.hero} alt="Hero" class="hero-image" />
      {/if}
    </div>
    
    <div class="content">
      {@html marked(page.body || 'Edit this text in the CMS at /admin →')}
    </div>
  </div>
</main>

<footer>
  <div class="container">
    <div class="footer-content">
      <div>
        © {new Date().getFullYear()} {company.name || 'My Company'}. All rights reserved.
      </div>
      <div>
        Last updated: {browser ? new Date(lastUpdate).toLocaleTimeString() : '...'}
      </div>
    </div>
  </div>
</footer>

<style>
  :root {
    --primary: #3b82f6;
    --primary-dark: #2563eb;
    --text: #1f2937;
    --text-light: #6b7280;
    --bg: #ffffff;
    --bg-light: #f9fafb;
    --border: #e5e7eb;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }
  
  
  header {
    background-color: var(--bg);
    box-shadow: var(--shadow);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--text);
    font-weight: 700;
    font-size: 1.5rem;
  }
  
  .logo img {
    height: 40px;
  }
  
  .nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
  }
  
  .nav-link {
    text-decoration: none;
    color: var(--text);
    font-weight: 500;
    padding: 0.5rem 0;
    position: relative;
    transition: color 0.2s;
  }
  
  .nav-link:hover {
    color: var(--primary);
  }
  
  .nav-link.active {
    color: var(--primary);
  }
  
  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--primary);
  }
  
  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text);
  }
  
  /* Main Content */
  main {
    padding: 4rem 0;
    min-height: calc(100vh - 200px);
  }
  
  .hero-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 4rem;
  }
  
  .hero-image {
    width: 100%;
    max-height: 500px;
    object-fit: cover;
    border-radius: 16px;
    margin: 2rem 0;
    box-shadow: var(--shadow);
  }
  
  h1 {
    font-size: 3.5rem;
    margin: 0.5rem 0;
    color: var(--text);
    line-height: 1.2;
  }
  
  .tagline {
    font-size: 1.6rem;
    color: var(--text-light);
    margin-bottom: 3rem;
    max-width: 700px;
  }
  
  .content {
    font-size: 1.2rem;
    line-height: 1.8;
    max-width: 800px;
    margin: 0 auto;
  }
  
  /* Footer */
  footer {
    background-color: var(--bg-light);
    border-top: 1px solid var(--border);
    padding: 2rem 0;
    margin-top: 5rem;
    color: var(--text-light);
    font-size: 0.9rem;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .mobile-menu-btn {
      display: block;
    }
    
    .nav-menu {
      position: fixed;
      top: 70px;
      left: 0;
      width: 100%;
      background-color: var(--bg);
      flex-direction: column;
      padding: 1.5rem;
      box-shadow: var(--shadow);
      transform: translateY(-100%);
      opacity: 0;
      transition: all 0.3s ease;
      pointer-events: none;
    }
    
    .nav-menu.open {
      transform: translateY(0);
      opacity: 1;
      pointer-events: all;
    }
    
    h1 {
      font-size: 2.5rem;
    }
    
    .tagline {
      font-size: 1.3rem;
    }
    
    .footer-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }
</style>