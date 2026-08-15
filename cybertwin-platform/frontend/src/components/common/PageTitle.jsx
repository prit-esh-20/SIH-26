function PageTitle({ title, subtitle, actions }) {
  return (
    <div className="page-title-row">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-title-actions">{actions}</div>}
    </div>
  );
}

export default PageTitle;
