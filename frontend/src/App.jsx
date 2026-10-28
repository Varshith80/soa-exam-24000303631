import { useCallback, useEffect, useMemo, useState } from 'react';

const emptyForm = {
  panelModel: '',
  manufacturer: '',
  wattage: '',
  unitPrice: '',
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');

async function request(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed (${response.status})`);
  }

  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type');
  return contentType?.includes('application/json') ? response.json() : response.text();
}

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  const paths = {
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    plus: <><path d="M12 5v14m-7-7h14" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bolt: <path d="m13 2-3 9h7l-6 11 2-9H6l7-11Z" />,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
    package: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 8 9 5 9-5m-18 0v9l9 5 9-5V8M12 13v9" /></>,
    edit: <><path d="m15 5 4 4M4 20l4-.8L19.2 8a2.1 2.1 0 0 0-3-3L5 16.2 4 20Z" /></>,
    trash: <><path d="M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v6m4-6v6" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    leaf: <><path d="M20 4c-9 0-15 4-15 11a5 5 0 0 0 5 5c7 0 11-6 10-16Z" /><path d="M5 19c2-4 5-7 10-10" /></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function MetricCard({ label, value, note, icon, tone }) {
  return (
    <article className="metric-card">
      <div className={`metric-icon ${tone}`}><Icon name={icon} size={19} /></div>
      <div className="metric-copy">
        <span className="metric-label">{label}</span>
        <strong>{value}</strong>
        <span className="metric-note">{note}</span>
      </div>
    </article>
  );
}

function PanelDialog({ panel, onClose, onSave, saving }) {
  const [form, setForm] = useState(panel ? {
    panelModel: panel.panelModel ?? '',
    manufacturer: panel.manufacturer ?? '',
    wattage: panel.wattage ?? '',
    unitPrice: panel.unitPrice ?? '',
  } : emptyForm);
  const [formError, setFormError] = useState('');
  const editing = Boolean(panel);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    const wattage = Number(form.wattage);
    const unitPrice = Number(form.unitPrice);
    if (!form.panelModel.trim() || !form.manufacturer.trim() || !form.wattage || !form.unitPrice) {
      setFormError('Complete every field before saving.');
      return;
    }
    if (!Number.isInteger(wattage) || wattage <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) {
      setFormError('Enter a positive whole-number wattage and a valid price.');
      return;
    }

    setFormError('');
    await onSave({
      panelModel: form.panelModel.trim(),
      manufacturer: form.manufacturer.trim(),
      wattage,
      unitPrice,
    });
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !saving) onClose();
    }}>
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="dialog-top">
          <div className="dialog-mark"><Icon name={editing ? 'edit' : 'plus'} size={19} /></div>
          <button className="icon-button dialog-close" onClick={onClose} aria-label="Close dialog" disabled={saving}><Icon name="close" /></button>
        </div>
        <p className="eyebrow">{editing ? 'UPDATE CATALOG ENTRY' : 'NEW CATALOG ENTRY'}</p>
        <h2 id="dialog-title">{editing ? 'Edit solar panel' : 'Add a solar panel'}</h2>
        <p className="dialog-description">Keep your inventory details accurate and up to date.</p>
        <form onSubmit={submit}>
          <label>
            Panel model
            <input autoFocus required name="panelModel" value={form.panelModel} onChange={updateField} placeholder="e.g. SunPower Maxeon 6" maxLength={120} />
          </label>
          <label>
            Manufacturer
            <input required name="manufacturer" value={form.manufacturer} onChange={updateField} placeholder="e.g. SunPower" maxLength={120} />
          </label>
          <div className="form-row">
            <label>
              Wattage
              <span className="input-unit"><input required name="wattage" type="number" min="1" step="1" value={form.wattage} onChange={updateField} placeholder="400" /><span>W</span></span>
            </label>
            <label>
              Unit price
              <span className="input-unit"><span className="currency-prefix">$</span><input required name="unitPrice" type="number" min="0" step="0.01" value={form.unitPrice} onChange={updateField} placeholder="299.00" /></span>
            </label>
          </div>
          {formError && <p className="form-error" role="alert">{formError}</p>}
          <div className="dialog-actions">
            <button type="button" className="button button-muted" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="button button-primary" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Add panel'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function App() {
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [dialogPanel, setDialogPanel] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [actionError, setActionError] = useState('');

  const loadPanels = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await request('/DisplayAll');
      if (!Array.isArray(data)) throw new Error('The server returned an unexpected inventory response.');
      setPanels(data);
    } catch (error) {
      setLoadError(error.message || 'Could not load the solar panel inventory.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPanels(); }, [loadPanels]);

  useEffect(() => {
    if (!notice && !actionError) return undefined;
    const timeout = window.setTimeout(() => {
      setNotice('');
      setActionError('');
    }, 4200);
    return () => window.clearTimeout(timeout);
  }, [notice, actionError]);

  const filteredPanels = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return panels;
    return panels.filter((panel) =>
      [panel.panelModel, panel.manufacturer, String(panel.wattage ?? ''), String(panel.id ?? '')]
        .some((value) => value?.toLocaleLowerCase().includes(query)),
    );
  }, [panels, search]);

  const averageWattage = panels.length
    ? Math.round(panels.reduce((sum, panel) => sum + Number(panel.wattage || 0), 0) / panels.length)
    : 0;
  const catalogValue = panels.reduce((sum, panel) => sum + Number(panel.unitPrice || 0), 0);

  function openCreate() {
    setDialogPanel(null);
    setDialogOpen(true);
    setActionError('');
  }

  function openEdit(panel) {
    setDialogPanel(panel);
    setDialogOpen(true);
    setActionError('');
  }

  async function savePanel(values) {
    setSaving(true);
    setActionError('');
    try {
      const editing = Boolean(dialogPanel);
      await request(editing ? `/Update/${dialogPanel.id}` : '/Add', {
        method: editing ? 'PUT' : 'POST',
        body: JSON.stringify(values),
      });
      setDialogOpen(false);
      setNotice(editing ? 'Panel details updated.' : 'Panel added to your inventory.');
      await loadPanels();
    } catch (error) {
      setActionError(error.message || 'Could not save this panel.');
    } finally {
      setSaving(false);
    }
  }

  async function deletePanel(panel) {
    if (!window.confirm(`Remove "${panel.panelModel}" from your inventory?`)) return;
    setActionError('');
    try {
      await request(`/Delete/${panel.id}`, { method: 'DELETE' });
      setNotice('Panel removed from your inventory.');
      await loadPanels();
    } catch (error) {
      setActionError(error.message || 'Could not remove this panel.');
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Solstice home">
          <span className="brand-icon"><Icon name="sun" size={22} /></span>
          <span>solstice<span className="brand-period">.</span></span>
        </a>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          <a className="nav-item active" href="#overview"><Icon name="grid" size={18} />Overview</a>
          <a className="nav-item" href="#inventory"><Icon name="package" size={18} />Panel inventory<span className="nav-count">{panels.length}</span></a>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-sun"><Icon name="leaf" size={18} /><span>Powering a brighter tomorrow.</span></div>
          <div className="profile">
            <div className="avatar">S</div>
            <div className="profile-copy"><strong>Solar team</strong><span>Inventory manager</span></div>
            <span className="online-dot" aria-label="Online" />
          </div>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>Overview</strong></div>
          <div className="topbar-right"><span className="live-status"><span />All systems operational</span><span className="topbar-date"><Icon name="sun" size={17} />Solar inventory</span></div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">YOUR CLEAN ENERGY CATALOG</p>
              <h1>Solar panel inventory<span>.</span></h1>
              <p className="welcome-subtitle">A clear view of your products, all in one place.</p>
            </div>
            <button className="button button-primary add-button" onClick={openCreate}><Icon name="plus" size={18} />Add panel</button>
          </section>

          <section className="metrics" aria-label="Inventory summary">
            <MetricCard label="Total panels" value={panels.length.toLocaleString()} note="Models in your catalog" icon="package" tone="green" />
            <MetricCard label="Average output" value={`${averageWattage.toLocaleString()} W`} note="Across all panel models" icon="bolt" tone="amber" />
            <MetricCard label="Catalog value" value={catalogValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} note="Combined unit prices" icon="arrow" tone="blue" />
          </section>

          <section className="inventory-card" id="inventory">
            <div className="inventory-heading">
              <div>
                <div className="title-with-count"><h2>Panel catalog</h2><span className="count-pill">{panels.length}</span></div>
                <p>Manage and review your solar panel models.</p>
              </div>
              <label className="search-box">
                <Icon name="search" size={18} />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search panels..." aria-label="Search panels" />
                {search && <button className="clear-search" onClick={() => setSearch('')} aria-label="Clear search"><Icon name="close" size={15} /></button>}
              </label>
            </div>

            {loadError && (
              <div className="load-error" role="alert">
                <div><strong>Couldn’t load your inventory</strong><span>{loadError}</span></div>
                <button className="button button-muted" onClick={loadPanels}>Try again</button>
              </div>
            )}

            <div className="table-scroll">
              <table>
                <thead><tr><th>PRODUCT</th><th>MANUFACTURER</th><th>OUTPUT</th><th>UNIT PRICE</th><th className="actions-heading">ACTIONS</th></tr></thead>
                <tbody>
                  {loading && !panels.length && <tr><td colSpan="5"><div className="table-state"><span className="spinner" />Loading your panels...</div></td></tr>}
                  {!loading && !loadError && filteredPanels.length === 0 && (
                    <tr><td colSpan="5"><div className="empty-state"><div className="empty-icon"><Icon name={search ? 'search' : 'sun'} size={23} /></div><strong>{search ? 'No matching panels' : 'Your catalog is ready'}</strong><span>{search ? 'Try another model name or manufacturer.' : 'Add your first panel to start building your inventory.'}</span>{!search && <button className="button button-primary" onClick={openCreate}><Icon name="plus" size={16} />Add your first panel</button>}</div></td></tr>
                  )}
                  {!loadError && filteredPanels.map((panel, index) => (
                    <tr key={panel.id}>
                      <td><div className="product-cell"><div className={`product-icon product-tone-${index % 4}`}><Icon name="sun" size={18} /></div><div><strong>{panel.panelModel || 'Unnamed panel'}</strong><span>SKU · {String(panel.id).padStart(4, '0')}</span></div></div></td>
                      <td><span className="manufacturer">{panel.manufacturer || '—'}</span></td>
                      <td><span className="wattage"><Icon name="bolt" size={15} />{Number(panel.wattage || 0).toLocaleString()} W</span></td>
                      <td><span className="price">{Number(panel.unitPrice || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span><span className="per-unit">per unit</span></td>
                      <td><div className="row-actions">
                        <button className="icon-button" onClick={() => openEdit(panel)} aria-label={`Edit ${panel.panelModel}`} title="Edit panel"><Icon name="edit" size={17} /></button>
                        <button className="icon-button danger-action" onClick={() => deletePanel(panel)} aria-label={`Delete ${panel.panelModel}`} title="Delete panel"><Icon name="trash" size={17} /></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <footer className="table-footer"><span>Showing <strong>{filteredPanels.length}</strong> of <strong>{panels.length}</strong> panels</span><span><span className="footer-dot" />Synced with your inventory</span></footer>
          </section>
          <footer className="page-footer"><span>Thoughtfully managing clean energy.</span><span>Solstice Inventory <span className="footer-separator">·</span> v1.0</span></footer>
        </div>
      </main>

      {(notice || actionError) && <div className={`toast ${actionError ? 'toast-error' : ''}`} role={actionError ? 'alert' : 'status'}>{actionError || notice}</div>}
      {dialogOpen && <PanelDialog panel={dialogPanel} onClose={() => setDialogOpen(false)} onSave={savePanel} saving={saving} />}
    </div>
  );
}
