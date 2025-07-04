window.addEventListener('scroll', function () {
  const header = document.querySelector('.header');
  if (window.scrollY > 10) {
    header.classList.add('header-fixed');
  } else {
    header.classList.remove('header-fixed');
  }
});