
const Container = ({ title, className, children }) => {
  return `
    <div class="${className} container-my">
      ${title !== "" ? `<h1>${title}</h1>` : ""}
      ${children}
    </div>
  `
};

export default Container;
