<script>
  // This runs only in browser, instantly loads the static admin
  if (import.meta.env.SSR === false) {
    location.replace('/admin/index.html');
  }
</script>