/* @ds-bundle: {"format":4,"namespace":"PsychometricLaboratoryDesignSystem_0d727f","components":[{"name":"AppSidebar","sourcePath":"components/app-shell/AppSidebar.jsx"},{"name":"AppTopbar","sourcePath":"components/app-shell/AppTopbar.jsx"},{"name":"Avatar","sourcePath":"components/app-shell/Avatar.jsx"},{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"Card","sourcePath":"components/cards/Card.jsx"},{"name":"DropdownCard","sourcePath":"components/cards/DropdownCard.jsx"},{"name":"Chip","sourcePath":"components/controls/Chip.jsx"},{"name":"SegmentedControl","sourcePath":"components/controls/SegmentedControl.jsx"},{"name":"Stepper","sourcePath":"components/controls/Stepper.jsx"},{"name":"Tabs","sourcePath":"components/controls/Tabs.jsx"},{"name":"EmptyState","sourcePath":"components/data/EmptyState.jsx"},{"name":"Panel","sourcePath":"components/data/Panel.jsx"},{"name":"ProgressBar","sourcePath":"components/data/ProgressBar.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"StatusDot","sourcePath":"components/data/StatusDot.jsx"},{"name":"SocialIcon","sourcePath":"components/feedback/SocialIcon.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"ToggleSwitch","sourcePath":"components/forms/ToggleSwitch.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"Header","sourcePath":"components/navigation/Header.jsx"},{"name":"Modal","sourcePath":"components/overlays/Modal.jsx"},{"name":"Table","sourcePath":"components/tables/Table.jsx"}],"sourceHashes":{"components/app-shell/AppSidebar.jsx":"93dff6d4ab39","components/app-shell/AppTopbar.jsx":"d0b402478f4d","components/app-shell/Avatar.jsx":"f27f10c906bc","components/buttons/Button.jsx":"29ca0983228f","components/cards/Card.jsx":"5769f9829c0f","components/cards/DropdownCard.jsx":"dc0497a49a6e","components/controls/Chip.jsx":"264891452376","components/controls/SegmentedControl.jsx":"438ec27304ec","components/controls/Stepper.jsx":"ec551ded099f","components/controls/Tabs.jsx":"747e0f942960","components/data/EmptyState.jsx":"dc040356ef22","components/data/Panel.jsx":"675d378cc0a3","components/data/ProgressBar.jsx":"0c2fcdadd0e5","components/data/StatCard.jsx":"93ae06c7c97d","components/data/StatusDot.jsx":"150726b6a054","components/feedback/SocialIcon.jsx":"2db76b49ec07","components/feedback/Tag.jsx":"b7dd5797f737","components/forms/Checkbox.jsx":"fdafd28bffb0","components/forms/Input.jsx":"57878e7947c8","components/forms/Select.jsx":"3962c9000f12","components/forms/Textarea.jsx":"bbd868efbaa1","components/forms/ToggleSwitch.jsx":"50357f105ca5","components/navigation/Footer.jsx":"0b2261ad2b3b","components/navigation/Header.jsx":"3b4ecd81a794","components/overlays/Modal.jsx":"0b9b50aeb7eb","components/tables/Table.jsx":"3d647bd49f79"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PsychometricLaboratoryDesignSystem_0d727f = window.PsychometricLaboratoryDesignSystem_0d727f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/app-shell/AppSidebar.jsx
try { (() => {
function AppSidebar({
  brandLogo,
  brandName,
  brandSub,
  sections = [],
  activeItem,
  onNavigate,
  org,
  style
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 'var(--sidebar-width)',
      background: 'var(--color-white)',
      borderRadius: 'var(--radius-standard)',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--spacing-narrow-l)',
      overflowY: 'auto',
      flexShrink: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-narrow-m)',
      padding: '8px 8px 24px',
      textDecoration: 'none',
      flexShrink: 0
    }
  }, brandLogo && /*#__PURE__*/React.createElement("img", {
    src: brandLogo,
    alt: "",
    style: {
      width: 44,
      height: 'auto',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1.1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-manrope)',
      fontWeight: 'var(--font-weight-bold)',
      fontSize: 15,
      color: 'var(--color-text-blue)'
    }
  }, brandName), brandSub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontWeight: 'var(--font-weight-light)',
      fontSize: 'var(--font-size-secondary)',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      color: 'var(--color-secondary-full)'
    }
  }, brandSub))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-narrow-xs)',
      flex: 1
    }
  }, sections.map(section => /*#__PURE__*/React.createElement(React.Fragment, {
    key: section.label || 'main'
  }, section.label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontWeight: 'var(--font-weight-semibold)',
      fontSize: 11,
      letterSpacing: '0.6px',
      textTransform: 'uppercase',
      color: 'var(--color-gray)',
      padding: '16px 16px 8px'
    }
  }, section.label), (section.items || []).map(item => {
    const active = item.name === activeItem;
    return /*#__PURE__*/React.createElement("a", {
      key: item.name,
      onClick: () => onNavigate && onNavigate(item.name),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-narrow-m)',
        padding: '8px 16px',
        borderRadius: 40,
        fontFamily: 'var(--font-manrope)',
        fontWeight: 'var(--font-weight-semibold)',
        fontSize: 'var(--font-size-content)',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        color: active ? 'var(--color-white)' : 'var(--color-primary-full)',
        background: active ? 'var(--color-primary-gradient)' : 'none',
        boxShadow: active ? 'var(--shadow-card)' : 'none'
      }
    }, item.icon, item.name, item.badge != null && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        background: active ? 'rgba(255,255,255,0.25)' : 'var(--color-secondary-gradient)',
        color: 'var(--color-white)',
        fontFamily: 'var(--font-inter)',
        fontWeight: 'var(--font-weight-bold)',
        fontSize: 11,
        minWidth: 20,
        height: 20,
        padding: '0 6px',
        borderRadius: 10,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, item.badge));
  })))), org && /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      marginTop: 'var(--spacing-narrow-l)',
      paddingTop: 'var(--spacing-narrow-l)',
      borderTop: '1px solid var(--color-light-gray)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-narrow-m)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: 'var(--color-primary-gradient)',
      color: 'var(--color-white)',
      fontFamily: 'var(--font-manrope)',
      fontWeight: 'var(--font-weight-bold)',
      fontSize: 15,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, org.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1.2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-manrope)',
      fontWeight: 'var(--font-weight-semibold)',
      fontSize: 14,
      color: 'var(--color-black)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, org.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--font-size-secondary)',
      color: 'var(--color-gray)'
    }
  }, org.plan))));
}
Object.assign(__ds_scope, { AppSidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/app-shell/AppSidebar.jsx", error: String((e && e.message) || e) }); }

// components/app-shell/AppTopbar.jsx
try { (() => {
const {
  useState
} = React;
function AppTopbar({
  title,
  subtitle,
  searchPlaceholder = 'Search…',
  profileName,
  profileInitials,
  unread = false,
  menuItems = [],
  onBurgerClick,
  onMenuSelect
}) {
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-narrow-l)',
      padding: 'var(--spacing-narrow-l) var(--spacing-standard-m)',
      background: 'var(--color-white)'
    }
  }, onBurgerClick && /*#__PURE__*/React.createElement("button", {
    onClick: onBurgerClick,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      width: 24,
      height: 18,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexShrink: 0,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: 24,
      height: 2.5,
      background: 'var(--color-primary-full)',
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: 24,
      height: 2.5,
      background: 'var(--color-primary-full)',
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: 24,
      height: 2.5,
      background: 'var(--color-primary-full)',
      borderRadius: 2
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-manrope)',
      fontWeight: 'var(--font-weight-bold)',
      fontSize: 28,
      color: 'var(--color-text-blue)',
      whiteSpace: 'nowrap'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: 14,
      color: 'var(--color-gray)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 280,
      maxWidth: '32vw'
    }
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: searchPlaceholder,
    style: {
      width: '100%',
      background: 'var(--color-white)',
      border: '1px solid var(--color-light-gray)',
      borderRadius: 'var(--radius-standard)',
      padding: '10px 16px 10px 42px',
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--font-size-content)',
      color: 'var(--color-black)',
      boxShadow: 'var(--shadow-inner)',
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--color-primary-full)",
    strokeWidth: "2",
    strokeLinecap: "round",
    style: {
      position: 'absolute',
      left: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 20l-3.6-3.6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(!open),
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-narrow-s)',
      background: 'var(--color-white)',
      border: '1px solid var(--color-light-gray)',
      boxShadow: 'var(--shadow-card)',
      borderRadius: 40,
      padding: '5px 8px 5px 5px',
      cursor: 'pointer',
      transition: 'all 0.25s ease'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: 'var(--color-primary-gradient)',
      color: 'var(--color-white)',
      fontFamily: 'var(--font-manrope)',
      fontWeight: 'var(--font-weight-bold)',
      fontSize: 13,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, profileInitials), unread && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: 30,
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--color-secondary-full)',
      border: '2px solid var(--color-white)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-manrope)',
      fontWeight: 'var(--font-weight-semibold)',
      fontSize: 14,
      color: 'var(--color-black)'
    }
  }, profileName), /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "8",
    viewBox: "0 0 12 8",
    fill: "none",
    stroke: "var(--color-primary-full)",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1.5L6 6.5L11 1.5"
  }))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 10px)',
      right: 0,
      minWidth: 200,
      background: 'var(--color-white)',
      borderRadius: 'var(--radius-standard)',
      boxShadow: 'var(--shadow-card)',
      padding: 'var(--spacing-narrow-s)',
      zIndex: 200
    }
  }, menuItems.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.name,
    onClick: () => {
      onMenuSelect && onMenuSelect(item.name);
      setOpen(false);
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-narrow-s)',
      width: '100%',
      textAlign: 'left',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '10px 16px',
      borderRadius: 'var(--radius-small)',
      fontFamily: 'var(--font-manrope)',
      fontWeight: 'var(--font-weight-semibold)',
      fontSize: 'var(--font-size-content)',
      color: item.danger ? 'var(--color-secondary-full)' : 'var(--color-primary-full)'
    }
  }, item.name, item.badge != null && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      background: 'var(--color-secondary-gradient)',
      color: 'var(--color-white)',
      fontFamily: 'var(--font-inter)',
      fontWeight: 'var(--font-weight-bold)',
      fontSize: 11,
      minWidth: 20,
      height: 20,
      padding: '0 6px',
      borderRadius: 10,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, item.badge))))));
}
Object.assign(__ds_scope, { AppTopbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/app-shell/AppTopbar.jsx", error: String((e && e.message) || e) }); }

// components/app-shell/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Avatar({
  initials,
  size = 'md',
  gradient,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      box: 34,
      font: 13
    },
    md: {
      box: 40,
      font: 15
    },
    lg: {
      box: 64,
      font: 22
    }
  };
  const s = sizes[size] || sizes.md;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: s.box,
      height: s.box,
      borderRadius: '50%',
      background: gradient || 'var(--color-primary-gradient)',
      color: 'var(--color-white)',
      fontFamily: 'var(--font-manrope)',
      fontWeight: 'var(--font-weight-bold)',
      fontSize: s.font,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      ...style
    }
  }, rest), initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/app-shell/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = {
  border: 'none',
  borderRadius: 'var(--radius-pill)',
  padding: '8px 24px',
  fontFamily: 'var(--font-manrope)',
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: 'var(--font-size-content)',
  lineHeight: 'var(--line-height-button)',
  cursor: 'pointer',
  transition: 'var(--ease-standard)',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--spacing-narrow-s)',
  boxShadow: 'var(--shadow-card)',
  textAlign: 'center'
};
const variants = {
  primary: {
    background: 'var(--color-primary-gradient)',
    color: 'var(--color-white)'
  },
  secondary: {
    background: 'var(--color-white)',
    color: 'var(--color-primary-full)'
  },
  danger: {
    background: 'var(--color-error-gradient)',
    color: 'var(--color-white)'
  },
  submit: {
    background: 'var(--color-disabled-gradient)',
    color: 'var(--color-white)'
  },
  ghost: {
    background: 'var(--color-white)',
    color: 'var(--color-primary-full)',
    border: '1px solid var(--color-light-gray)'
  }
};
function Button({
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  icon,
  children,
  onClick,
  type = 'button',
  style,
  ...rest
}) {
  const v = variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    onClick: onClick,
    disabled: disabled,
    style: {
      ...base,
      ...v,
      width: fullWidth ? '100%' : undefined,
      ...(disabled ? {
        background: 'var(--color-disabled-gradient)',
        color: 'var(--color-white)',
        cursor: 'not-allowed'
      } : null),
      ...style
    }
  }, rest), icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/cards/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const variants = {
  base: {
    background: 'var(--color-white)',
    color: 'var(--color-black)'
  },
  primary: {
    background: 'var(--color-primary-gradient)',
    color: '#fff'
  },
  secondary: {
    background: 'var(--color-secondary-gradient)',
    color: '#fff'
  }
};
function Card({
  variant = 'base',
  hoverable = false,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const v = variants[variant] || variants.base;
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => hoverable && setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      borderRadius: 'var(--radius-standard)',
      boxShadow: hoverable && hover ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
      padding: 'var(--spacing-narrow-l)',
      transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      transform: hoverable && hover ? 'translateY(-2px)' : 'none',
      cursor: hoverable ? 'pointer' : 'default',
      ...v,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/Card.jsx", error: String((e && e.message) || e) }); }

// components/cards/DropdownCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function DropdownCard({
  title,
  defaultOpen = true,
  children,
  style,
  ...rest
}) {
  const [open, setOpen] = useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--color-white)',
      borderRadius: 'var(--radius-standard)',
      boxShadow: 'var(--shadow-card)',
      padding: 'var(--spacing-narrow-l)',
      transition: 'var(--ease-standard)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--spacing-narrow-m)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-manrope)',
      fontWeight: 'var(--font-weight-semibold)',
      fontSize: 'var(--font-size-title-large)',
      color: 'var(--color-text-blue)',
      margin: 0
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(!open),
    style: {
      background: 'none',
      border: 'none',
      padding: 0,
      width: 20,
      height: 20,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--color-primary-full)",
    strokeWidth: "2",
    strokeLinecap: "round",
    style: {
      transform: open ? 'none' : 'rotate(180deg)',
      transition: 'transform 0.3s ease'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 15l6-6 6 6"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: open ? 'var(--spacing-narrow-m)' : 0,
      maxHeight: open ? 1200 : 0,
      opacity: open ? 1 : 0,
      overflow: 'hidden',
      transition: 'max-height 0.3s ease, opacity 0.3s ease'
    }
  }, children));
}
Object.assign(__ds_scope, { DropdownCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/DropdownCard.jsx", error: String((e && e.message) || e) }); }

// components/controls/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Chip({
  active = false,
  children,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick,
    style: {
      padding: '6px 14px',
      borderRadius: 999,
      cursor: 'pointer',
      fontFamily: 'var(--font-inter)',
      fontSize: 13,
      background: active ? 'var(--color-primary-light)' : 'var(--color-white)',
      border: `1px solid ${active ? 'var(--color-primary-full)' : 'var(--color-light-gray)'}`,
      color: active ? 'var(--color-white)' : 'var(--color-gray)',
      boxShadow: active ? 'var(--shadow-card)' : 'none',
      transition: 'var(--ease-fast)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/Chip.jsx", error: String((e && e.message) || e) }); }

// components/controls/SegmentedControl.jsx
try { (() => {
function SegmentedControl({
  options = [],
  value,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      background: 'var(--color-white)',
      border: '1px solid var(--color-light-gray)',
      borderRadius: 50,
      padding: 4,
      boxShadow: 'var(--shadow-card)',
      flexShrink: 0,
      ...style
    }
  }, options.map(opt => {
    const name = typeof opt === 'string' ? opt : opt.name;
    const isActive = name === value;
    return /*#__PURE__*/React.createElement("button", {
      key: name,
      onClick: () => onChange && onChange(name),
      style: {
        border: 'none',
        cursor: 'pointer',
        background: isActive ? 'var(--color-primary-gradient)' : 'none',
        boxShadow: isActive ? 'var(--shadow-card)' : 'none',
        fontFamily: 'var(--font-manrope)',
        fontWeight: 'var(--font-weight-semibold)',
        fontSize: 14,
        color: isActive ? 'var(--color-white)' : 'var(--color-gray)',
        padding: '8px 18px',
        borderRadius: 50,
        whiteSpace: 'nowrap',
        transition: 'color 0.28s ease, background 0.28s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--spacing-narrow-s)'
      }
    }, name, typeof opt !== 'string' && opt.price != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-manrope)',
        fontWeight: 'var(--font-weight-bold)',
        fontSize: 13,
        padding: '1px 8px',
        borderRadius: 50,
        background: isActive ? 'rgba(255,255,255,0.28)' : 'var(--color-light-gray)',
        color: isActive ? 'var(--color-white)' : 'var(--color-black)'
      }
    }, opt.price));
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/controls/Stepper.jsx
try { (() => {
function Stepper({
  steps = [],
  current = 0,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      ...style
    }
  }, steps.map((label, i) => {
    const done = i < current;
    const active = i === current;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: label
    }, i > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 3,
        background: i <= current ? 'var(--color-primary-full)' : 'var(--color-light-gray)',
        borderRadius: 2,
        margin: '18px 8px 0',
        transition: 'background 0.25s ease'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: done || active ? 'var(--color-primary-gradient)' : 'var(--color-light-gray)',
        color: done || active ? 'var(--color-white)' : 'var(--color-gray)',
        fontFamily: 'var(--font-manrope)',
        fontWeight: 'var(--font-weight-bold)',
        transition: 'all 0.25s ease'
      }
    }, i + 1), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-inter)',
        fontSize: 14,
        color: done || active ? 'var(--color-primary-full)' : 'var(--color-gray)',
        fontWeight: done || active ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)'
      }
    }, label)));
  }));
}
Object.assign(__ds_scope, { Stepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/Stepper.jsx", error: String((e && e.message) || e) }); }

// components/controls/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  active,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--spacing-narrow-l)',
      borderBottom: '1px solid var(--color-light-gray)',
      ...style
    }
  }, tabs.map(tab => {
    const name = typeof tab === 'string' ? tab : tab.name;
    const count = typeof tab === 'string' ? undefined : tab.count;
    const isActive = name === active;
    return /*#__PURE__*/React.createElement("button", {
      key: name,
      onClick: () => onChange && onChange(name),
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-manrope)',
        fontWeight: 'var(--font-weight-semibold)',
        fontSize: 'var(--font-size-content)',
        color: isActive ? 'var(--color-text-blue)' : 'var(--color-gray)',
        padding: '0 0 var(--spacing-narrow-m)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-narrow-s)',
        transition: 'color 0.2s ease'
      }
    }, name, count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        background: isActive ? 'var(--color-primary-light)' : 'var(--color-light-gray)',
        color: isActive ? 'var(--color-white)' : 'var(--color-black)',
        fontFamily: 'var(--font-inter)',
        fontWeight: 'var(--font-weight-semibold)',
        fontSize: 11,
        minWidth: 20,
        height: 20,
        padding: '0 6px',
        borderRadius: 10,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: isActive ? 'scale(1.05)' : 'none',
        transition: 'all 0.25s ease'
      }
    }, count), isActive && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -1,
        height: 3,
        borderRadius: '3px 3px 0 0',
        background: 'var(--color-primary-gradient)'
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/data/EmptyState.jsx
try { (() => {
function EmptyState({
  title,
  description,
  action,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: 'var(--spacing-standard-l) var(--spacing-narrow-l)',
      color: 'var(--color-gray)',
      ...style
    }
  }, title && /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-manrope)',
      fontWeight: 'var(--font-weight-semibold)',
      fontSize: 'var(--font-size-content)',
      color: 'var(--color-black)',
      marginBottom: 'var(--spacing-narrow-s)'
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: 14,
      marginBottom: action ? 'var(--spacing-narrow-l)' : 0
    }
  }, description), action);
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/data/Panel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Panel({
  title,
  action,
  footer,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--color-white)',
      borderRadius: 'var(--radius-standard)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden',
      ...style
    }
  }, rest), (title || action) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--spacing-narrow-m)',
      padding: 'var(--spacing-narrow-l)',
      flexWrap: 'wrap'
    }
  }, title && /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-manrope)',
      fontWeight: 'var(--font-weight-semibold)',
      fontSize: 'var(--font-size-title-large)',
      color: 'var(--color-text-blue)',
      margin: 0
    }
  }, title), action), children, footer && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: 'var(--spacing-narrow-m)'
    }
  }, footer));
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Panel.jsx", error: String((e && e.message) || e) }); }

// components/data/ProgressBar.jsx
try { (() => {
function ProgressBar({
  value = 0,
  max = 100,
  label,
  style
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-narrow-s)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 6,
      background: 'var(--color-light-gray)',
      borderRadius: 3,
      overflow: 'hidden',
      minWidth: 60
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${pct}%`,
      background: 'var(--color-primary-gradient)',
      borderRadius: 3
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--font-size-secondary)',
      color: 'var(--color-gray)',
      whiteSpace: 'nowrap'
    }
  }, label));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StatCard({
  label,
  value,
  sub,
  subTone,
  icon,
  plain = false,
  style,
  ...rest
}) {
  const tones = {
    up: 'var(--color-green-full)',
    warn: 'var(--color-secondary-full)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: plain ? 'transparent' : 'var(--color-white)',
      borderRadius: plain ? 0 : 'var(--radius-standard)',
      boxShadow: plain ? 'none' : 'var(--shadow-card)',
      padding: plain ? '2px var(--spacing-standard-m)' : 'var(--spacing-narrow-l)',
      transition: 'var(--ease-standard)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--spacing-narrow-s)',
      marginBottom: 'var(--spacing-narrow-m)'
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-manrope)',
      fontSize: 'var(--font-size-title-large)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-blue)',
      lineHeight: 'var(--line-height-tight)'
    }
  }, label)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-manrope)',
      fontWeight: 'var(--font-weight-bold)',
      fontSize: 30,
      color: 'var(--color-text-blue)',
      lineHeight: 1.1
    }
  }, value), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--font-size-secondary)',
      color: tones[subTone] || 'var(--color-gray)',
      marginTop: 'var(--spacing-narrow-s)'
    }
  }, sub)));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/data/StatusDot.jsx
try { (() => {
function StatusDot({
  tone = 'primary',
  label,
  style
}) {
  const tones = {
    primary: 'var(--color-primary-full)',
    green: 'var(--color-green-full)',
    red: 'var(--color-error-full)',
    yellow: 'var(--color-yellow-full)'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-inter)',
      fontSize: 14,
      color: 'var(--color-black)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: tones[tone] || tones.primary,
      flexShrink: 0
    }
  }), label);
}
Object.assign(__ds_scope, { StatusDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatusDot.jsx", error: String((e && e.message) || e) }); }

// components/feedback/SocialIcon.jsx
try { (() => {
const {
  useState
} = React;
function SocialIcon({
  defaultSrc,
  hoverSrc,
  label,
  href = '#',
  size = 24
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    "aria-label": label,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: size,
      height: size,
      position: 'relative',
      display: 'inline-block',
      cursor: 'pointer',
      transition: 'var(--ease-standard)',
      transform: hover ? 'scale(1.2)' : 'none',
      filter: hover ? 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' : 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: defaultSrc,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      opacity: hover ? 0 : 1,
      transition: 'opacity 0.3s ease'
    }
  }), hoverSrc && /*#__PURE__*/React.createElement("img", {
    src: hoverSrc,
    alt: "",
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      opacity: hover ? 1 : 0,
      transition: 'opacity 0.3s ease'
    }
  }));
}
Object.assign(__ds_scope, { SocialIcon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/SocialIcon.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const colors = {
  secondary: {
    bg: 'var(--color-secondary-light)',
    border: 'var(--color-secondary-full)',
    color: '#fff'
  },
  primary: {
    bg: 'var(--color-primary-light)',
    border: 'var(--color-primary-full)',
    color: '#fff'
  },
  yellow: {
    bg: 'var(--color-facet-yellow-light)',
    border: 'var(--color-facet-yellow-full)',
    color: 'var(--color-black)'
  },
  green: {
    bg: 'var(--color-facet-green-light)',
    border: 'var(--color-facet-green-full)',
    color: '#fff'
  },
  magenta: {
    bg: 'var(--color-facet-magenta-light)',
    border: 'var(--color-facet-magenta-full)',
    color: '#fff'
  },
  purple: {
    bg: 'var(--color-facet-purple-light)',
    border: 'var(--color-facet-purple-full)',
    color: '#fff'
  },
  red: {
    bg: 'var(--color-facet-red-light)',
    border: 'var(--color-facet-red-full)',
    color: '#fff'
  }
};
function Tag({
  color = 'secondary',
  children,
  style,
  ...rest
}) {
  const c = colors[color] || colors.secondary;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.color,
      fontFamily: 'var(--font-inter)',
      fontWeight: 'var(--font-weight-bold)',
      fontSize: 'var(--font-size-secondary)',
      padding: '4px 12px',
      borderRadius: 'var(--radius-standard)',
      boxShadow: '0px 1px 2px rgba(0,0,0,0.1)',
      display: 'inline-block',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  checked = false,
  onChange,
  label
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--spacing-narrow-s)',
      cursor: 'pointer',
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--font-size-content)',
      color: 'var(--color-black)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => onChange && onChange(!checked),
    style: {
      position: 'relative',
      width: 32,
      height: 32,
      background: checked ? 'var(--color-primary-gradient)' : '#fff',
      borderRadius: 'var(--radius-small)',
      boxShadow: 'var(--shadow-card)',
      transition: 'var(--ease-standard)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      background: '#fff',
      borderRadius: '50%'
    }
  })), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-narrow-s)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--font-size-content)',
      color: 'var(--color-primary-full)'
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    style: {
      background: 'var(--color-white-gradient)',
      border: 'none',
      borderRadius: 'var(--radius-standard)',
      padding: 'var(--spacing-narrow-m)',
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--font-size-content)',
      color: 'var(--color-black)',
      boxShadow: 'var(--shadow-inner)',
      outline: 'none',
      width: '100%',
      transition: 'var(--ease-standard)',
      ...style
    }
  }, rest)));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
const {
  useState,
  useRef,
  useEffect
} = React;
function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select…'
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-narrow-s)',
      position: 'relative',
      fontFamily: 'var(--font-inter)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 'var(--font-size-content)',
      color: 'var(--color-primary-full)'
    }
  }, label), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(!open),
    style: {
      background: 'var(--color-primary-gradient)',
      color: '#fff',
      border: 'none',
      borderRadius: 'var(--radius-standard)',
      padding: '8px 16px',
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--font-size-content)',
      cursor: 'pointer',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      width: '100%'
    }
  }, value || placeholder, /*#__PURE__*/React.createElement("span", null, "\u25BE")), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      background: '#fff',
      borderRadius: 'var(--radius-standard)',
      boxShadow: 'var(--shadow-card)',
      padding: 8,
      zIndex: 10,
      marginTop: 4,
      minWidth: 180
    }
  }, options.map(opt => /*#__PURE__*/React.createElement("button", {
    key: opt,
    type: "button",
    onClick: () => {
      onChange && onChange(opt);
      setOpen(false);
    },
    style: {
      display: 'block',
      width: '100%',
      padding: '8px 16px',
      background: 'none',
      border: 'none',
      textAlign: 'left',
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--font-size-content)',
      color: 'var(--color-primary-full)',
      cursor: 'pointer',
      borderRadius: 'var(--radius-small)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--color-primary-light)';
      e.currentTarget.style.color = '#fff';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'none';
      e.currentTarget.style.color = 'var(--color-primary-full)';
    }
  }, opt))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Textarea({
  label,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-narrow-s)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--font-size-content)',
      color: 'var(--color-primary-full)'
    }
  }, label), /*#__PURE__*/React.createElement("textarea", _extends({
    style: {
      background: 'var(--color-white-gradient)',
      border: 'none',
      borderRadius: 'var(--radius-standard)',
      padding: 'var(--spacing-narrow-m)',
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--font-size-content)',
      color: 'var(--color-black)',
      boxShadow: 'var(--shadow-inner)',
      outline: 'none',
      width: '100%',
      minHeight: '96px',
      resize: 'vertical',
      transition: 'var(--ease-standard)',
      ...style
    }
  }, rest)));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/forms/ToggleSwitch.jsx
try { (() => {
function ToggleSwitch({
  on = true,
  onChange,
  label
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--spacing-narrow-s)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => onChange && onChange(!on),
    style: {
      position: 'relative',
      width: 36,
      height: 20,
      border: 'none',
      borderRadius: 'var(--radius-standard)',
      padding: 0,
      cursor: 'pointer',
      overflow: 'hidden',
      transition: 'box-shadow 0.25s ease',
      background: on ? 'var(--color-primary-gradient)' : 'var(--color-primary-light)',
      boxShadow: on ? '0px 0px 2px 0px rgba(0,0,0,0.25)' : 'var(--shadow-inner)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      content: "''",
      width: 14,
      height: 14,
      background: '#fff',
      borderRadius: '50%',
      transition: 'transform 0.25s ease',
      position: 'absolute',
      top: 3,
      right: 3,
      boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
      transform: on ? 'scale(1.05)' : 'translateX(-16px) scale(0.95)',
      display: 'block'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontWeight: 'var(--font-weight-light)',
      fontSize: 'var(--font-size-secondary)',
      color: 'var(--color-black)'
    }
  }, label));
}
Object.assign(__ds_scope, { ToggleSwitch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/ToggleSwitch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState,
  useEffect,
  useRef
} = React; // Measures the footer's own root rather than the window, so the column count is correct
// inside constrained columns and preview frames alike.
function useContainerWidth(ref, fallback = 1440) {
  const [w, setW] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = next => {
      if (next > 0) setW(next);
    };
    measure(el.getBoundingClientRect().width);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) measure(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}
function SocialLink({
  defaultSrc,
  hoverSrc,
  label,
  href = '#'
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    "aria-label": label,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: 24,
      height: 24,
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.3s ease',
      transform: hover ? 'scale(1.1)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: defaultSrc,
    alt: "",
    style: {
      width: 24,
      height: 24,
      display: 'block',
      opacity: hover ? 0 : 1,
      transition: 'opacity 0.3s ease'
    }
  }), hoverSrc && /*#__PURE__*/React.createElement("img", {
    src: hoverSrc,
    alt: "",
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 24,
      height: 24,
      display: 'block',
      opacity: hover ? 1 : 0,
      transition: 'opacity 0.3s ease'
    }
  }));
}
function Footer({
  logo,
  tagline,
  social = [],
  columns = [],
  impressum,
  legalLinks = [],
  copyright,
  onNavigate
}) {
  const rootRef = useRef(null);
  const w = useContainerWidth(rootRef);
  const narrow = w < 1225;
  const stacked = w < 768;
  const linkStyle = {
    color: '#ffffff',
    textDecoration: 'none',
    fontFamily: 'var(--font-inter)',
    fontWeight: 'var(--font-weight-regular)',
    fontSize: 'var(--font-size-content)',
    lineHeight: 'var(--line-height-normal)',
    transition: 'opacity 0.3s ease',
    cursor: 'pointer'
  };
  return /*#__PURE__*/React.createElement("footer", {
    ref: rootRef,
    style: {
      background: 'var(--color-primary-gradient)',
      color: '#ffffff',
      padding: stacked ? 'var(--spacing-standard-m) 0 var(--spacing-narrow-l)' : 'var(--spacing-standard-l) 0 var(--spacing-narrow-l)',
      position: 'relative',
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 1440,
      margin: '0 auto',
      padding: stacked ? '0 var(--spacing-narrow-l)' : narrow ? '0 var(--spacing-standard-s)' : '0 96px',
      display: 'flex',
      flexDirection: 'column',
      gap: stacked ? 'var(--spacing-narrow-l)' : 'var(--spacing-standard-s)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: stacked ? '1fr' : narrow ? '1fr 1fr' : '1.4fr 1fr 1fr 1fr 1.2fr',
      gap: stacked ? 'var(--spacing-narrow-l)' : 'var(--spacing-standard-s)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-narrow-l)',
      maxWidth: narrow ? 'none' : 320,
      gridColumn: narrow && !stacked ? '1 / -1' : undefined
    }
  }, logo && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 48,
      width: 'auto',
      maxWidth: 220
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: logo,
    alt: "",
    style: {
      height: '100%',
      width: 'auto',
      maxWidth: '100%',
      objectFit: 'contain',
      display: 'block',
      filter: 'brightness(0) invert(1)'
    }
  })), tagline && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--font-size-content)',
      lineHeight: 'var(--line-height-normal)',
      color: '#ffffff',
      margin: 0
    }
  }, tagline), social.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--spacing-narrow-m)',
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, social.map(s => /*#__PURE__*/React.createElement(SocialLink, _extends({
    key: s.label
  }, s))))), columns.map(col => /*#__PURE__*/React.createElement("div", {
    key: col.heading,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-narrow-m)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-manrope)',
      fontWeight: 'var(--font-weight-semibold)',
      fontSize: 'var(--font-size-content)',
      lineHeight: 'var(--line-height-button)',
      color: '#ffffff',
      margin: 0
    }
  }, col.heading), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-narrow-s)'
    }
  }, (col.links || []).map(link => /*#__PURE__*/React.createElement("li", {
    key: link
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNavigate && onNavigate(link),
    style: linkStyle
  }, link)))))), impressum && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-narrow-s)',
      fontFamily: 'var(--font-inter)',
      fontWeight: 'var(--font-weight-regular)',
      fontSize: 'var(--font-size-secondary)',
      lineHeight: 'var(--line-height-normal)',
      color: '#ffffff'
    }
  }, impressum.title && /*#__PURE__*/React.createElement("strong", {
    style: {
      fontFamily: 'var(--font-manrope)',
      fontWeight: 'var(--font-weight-semibold)',
      fontSize: 'var(--font-size-content)',
      display: 'block',
      marginBottom: 4
    }
  }, impressum.title), (impressum.lines || []).map(line => /*#__PURE__*/React.createElement("p", {
    key: line,
    style: {
      margin: 0,
      color: '#ffffff'
    }
  }, line)))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(255,255,255,0.28)',
      paddingTop: 'var(--spacing-narrow-l)',
      display: 'flex',
      alignItems: stacked ? 'flex-start' : 'center',
      justifyContent: 'space-between',
      gap: 'var(--spacing-narrow-l)',
      flexWrap: 'wrap',
      flexDirection: stacked ? 'column' : 'row'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--spacing-narrow-l)',
      flexWrap: 'wrap'
    }
  }, legalLinks.map(link => /*#__PURE__*/React.createElement("a", {
    key: link,
    onClick: () => onNavigate && onNavigate(link),
    style: {
      color: '#ffffff',
      textDecoration: 'none',
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--font-size-secondary)',
      transition: 'opacity 0.3s ease',
      cursor: 'pointer'
    }
  }, link))), copyright && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontWeight: 'var(--font-weight-light)',
      fontSize: 'var(--font-size-secondary)',
      color: '#ffffff',
      textAlign: stacked ? 'left' : 'right',
      letterSpacing: '0.24px',
      lineHeight: 'var(--line-height-normal)',
      margin: 0
    }
  }, copyright))));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Header.jsx
try { (() => {
const {
  useState,
  useEffect,
  useRef
} = React;
const BLUE_FILTER = 'brightness(0) saturate(100%) invert(56%) sepia(89%) saturate(1053%) hue-rotate(165deg) brightness(93%) contrast(91%)';

// Measures the header's own root rather than the window, so the layout is correct
// inside constrained columns and preview frames alike.
function useContainerNarrow(ref, breakpoint = 1225) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = w => setNarrow(w > 0 && w < breakpoint);
    measure(el.getBoundingClientRect().width);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) measure(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, breakpoint]);
  return narrow;
}
function NavItem({
  label,
  children,
  mobile,
  active,
  open,
  onToggle,
  onSelect,
  dropdownArrow
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("a", {
    onClick: () => children ? onToggle() : onSelect(label),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: mobile ? 'flex-start' : 'center',
      gap: 'var(--spacing-narrow-s)',
      fontFamily: 'var(--font-manrope)',
      fontWeight: 400,
      fontSize: 16,
      color: hover ? 'var(--color-secondary-full)' : 'var(--color-text-blue)',
      textDecoration: 'none',
      padding: mobile ? '16px 0' : '0 16px',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      borderBottom: mobile ? '1px solid var(--color-light-gray)' : undefined,
      borderTop: mobile && active ? '1px solid var(--color-light-gray)' : undefined
    }
  }, label, children && /*#__PURE__*/React.createElement("img", {
    src: dropdownArrow,
    alt: "",
    style: {
      width: 14,
      height: 8,
      filter: BLUE_FILTER,
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform 0.3s ease'
    }
  }));
}
function IconButton({
  src,
  hoverSrc,
  size,
  label,
  onClick,
  scaleOnHover
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": label,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: size,
      height: size,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      outline: 'none',
      boxShadow: 'none',
      flexShrink: 0,
      transition: 'transform 0.3s ease',
      transform: scaleOnHover && hover ? 'scale(1.1)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: hover && hoverSrc ? hoverSrc : src,
    alt: "",
    style: {
      width: '100%',
      height: '100%'
    }
  }));
}
function CtaButton({
  label,
  arrow,
  fullWidth,
  onClick
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("a", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: hover ? '#ffffff' : 'var(--color-primary-gradient)',
      color: hover ? 'var(--color-primary-full)' : '#ffffff',
      border: 'none',
      borderRadius: 'var(--radius-pill)',
      padding: '8px 24px',
      fontFamily: 'var(--font-manrope)',
      fontWeight: 'var(--font-weight-semibold)',
      fontSize: 'var(--font-size-content)',
      lineHeight: 'var(--line-height-button)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-narrow-m)',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      flexShrink: 0,
      boxShadow: hover ? '0px 2px 8px 0px rgba(0,0,0,0.15), 0px 6px 24px 0px rgba(0,0,0,0.2)' : 'var(--shadow-card)',
      transform: hover ? 'translateY(-2px)' : 'none',
      width: fullWidth ? '100%' : undefined,
      justifyContent: fullWidth ? 'center' : undefined,
      margin: fullWidth ? '16px 0' : undefined
    }
  }, label, arrow && /*#__PURE__*/React.createElement("img", {
    src: arrow,
    alt: "",
    style: {
      width: 16,
      height: 16,
      filter: hover ? BLUE_FILTER : 'none',
      transition: 'filter 0.3s ease'
    }
  }));
}
function MenuPanel({
  items,
  align = 'left',
  onSelect
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      [align]: 0,
      background: '#ffffff',
      borderRadius: 16,
      boxShadow: 'var(--shadow-card)',
      padding: 8,
      minWidth: align === 'right' ? 160 : 200,
      zIndex: 200
    }
  }, items.map(item => /*#__PURE__*/React.createElement(MenuPanelItem, {
    key: item,
    label: item,
    onSelect: onSelect
  })));
}
function MenuPanelItem({
  label,
  onSelect
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("a", {
    onClick: () => onSelect(label),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'block',
      width: '100%',
      padding: '12px 16px',
      textAlign: 'left',
      background: hover ? 'var(--color-primary-light)' : 'none',
      color: hover ? '#ffffff' : 'var(--color-text-blue)',
      textDecoration: 'none',
      fontFamily: 'var(--font-inter)',
      fontSize: 16,
      borderRadius: 8,
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }
  }, label);
}
function Header({
  logo,
  navItems = ['Shop', 'Accreditation', 'Coaching', {
    name: 'Resources',
    items: ['Case Studies', 'Articles', 'Academic Website']
  }],
  mobileNavItems,
  ctaLabel = 'Request Demo',
  languages = ['English', 'Español', 'Français', 'Deutsch', 'Italiano', '中文'],
  showLanguage = true,
  loggedIn = false,
  iconBase = '../../assets/icons',
  onNavigate,
  onCtaClick,
  onLoginClick,
  onLanguageSelect
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const rootRef = useRef(null);
  const isMobile = useContainerNarrow(rootRef, 1225);
  const arrow = `${iconBase}/ui/request-demo-arrow.svg`;
  const dropdownArrow = `${iconBase}/ui/dropdown-arrow.svg`;
  const userIcon = loggedIn ? `${iconBase}/user/logged-in.svg` : `${iconBase}/user/guest.svg`;
  const userIconHover = loggedIn ? `${iconBase}/user/logged-in-hover.svg` : `${iconBase}/user/guest-hover.svg`;
  const select = name => {
    setOpenMenu(null);
    setMobileOpen(false);
    onNavigate && onNavigate(name);
  };
  const flatMobile = mobileNavItems || navItems.flatMap(i => typeof i === 'string' ? [i] : i.items || [i.name]);
  const languageButton = size => /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    src: `${iconBase}/ui/language.svg`,
    size: size,
    label: "Language",
    scaleOnHover: true,
    onClick: () => setOpenMenu(openMenu === 'lang' ? null : 'lang')
  }), openMenu === 'lang' && /*#__PURE__*/React.createElement(MenuPanel, {
    items: languages,
    align: "right",
    onSelect: l => {
      setOpenMenu(null);
      onLanguageSelect && onLanguageSelect(l);
    }
  }));
  return /*#__PURE__*/React.createElement("div", {
    ref: rootRef,
    style: {
      position: 'sticky',
      top: 0,
      background: 'linear-gradient(to bottom, #ffffff 27.55%, rgba(255,255,255,0) 100%)',
      padding: isMobile ? 'var(--spacing-narrow-m)' : 'var(--spacing-narrow-m) 80px',
      zIndex: 10000,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? 0 : 40,
      background: '#ffffff',
      borderRadius: isMobile ? 10 : 15,
      boxShadow: isMobile ? '0px 0px 8px 1px rgba(0,0,0,0.15)' : '0px 0px 24px 8px rgba(0,0,0,0.15)',
      padding: isMobile ? 16 : '11px 24px 11px 16px',
      position: isMobile ? 'relative' : 'static'
    }
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      width: isMobile ? 'auto' : 56,
      height: isMobile ? 18 : undefined,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? 0 : '0 5px',
      flexShrink: 0,
      position: isMobile ? 'absolute' : 'static',
      left: isMobile ? '50%' : undefined,
      transform: isMobile ? 'translateX(-50%)' : undefined,
      cursor: 'pointer'
    }
  }, logo && /*#__PURE__*/React.createElement("img", {
    src: logo,
    alt: "Psychometric Laboratory",
    style: isMobile ? {
      height: '100%',
      width: 'auto'
    } : {
      width: '100%',
      height: 'auto'
    }
  })), !isMobile && /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 40,
      alignItems: 'center',
      flex: 1
    }
  }, navItems.map(item => {
    const name = typeof item === 'string' ? item : item.name;
    const children = typeof item === 'string' ? null : item.items;
    return /*#__PURE__*/React.createElement("div", {
      key: name,
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(NavItem, {
      label: name,
      children: children,
      open: openMenu === name,
      dropdownArrow: dropdownArrow,
      onToggle: () => setOpenMenu(openMenu === name ? null : name),
      onSelect: select
    }), children && openMenu === name && /*#__PURE__*/React.createElement(MenuPanel, {
      items: children,
      onSelect: select
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? 0 : 'var(--spacing-narrow-l)',
      flexShrink: 0,
      width: isMobile ? '100%' : undefined,
      justifyContent: isMobile ? 'space-between' : undefined
    }
  }, isMobile && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Open menu",
    onClick: () => setMobileOpen(!mobileOpen),
    style: {
      display: 'flex',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      width: 20,
      height: 16,
      position: 'relative',
      order: 1,
      outline: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      position: 'absolute',
      left: 0,
      top: 0,
      width: 20,
      height: 2.5,
      background: 'var(--color-primary-full)',
      borderRadius: 11,
      transition: 'all 0.3s ease',
      transform: mobileOpen ? 'rotate(-45deg) translate(-5px, 6px)' : 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      position: 'absolute',
      left: 0,
      top: '50%',
      width: 20,
      height: 2.5,
      background: 'var(--color-primary-full)',
      borderRadius: 11,
      transition: 'all 0.3s ease',
      transform: 'translateY(-50%)',
      opacity: mobileOpen ? 0 : 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: 20,
      height: 2.5,
      background: 'var(--color-primary-full)',
      borderRadius: 11,
      transition: 'all 0.3s ease',
      transform: mobileOpen ? 'rotate(45deg) translate(-5px, -6px)' : 'none'
    }
  })), !isMobile && /*#__PURE__*/React.createElement(CtaButton, {
    label: ctaLabel,
    arrow: arrow,
    onClick: onCtaClick
  }), !isMobile && showLanguage && languageButton(32), /*#__PURE__*/React.createElement("div", {
    style: {
      order: isMobile ? 2 : undefined
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    src: userIcon,
    hoverSrc: userIconHover,
    size: isMobile ? 32 : 48,
    label: "Login",
    onClick: onLoginClick
  })))), isMobile && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: () => setMobileOpen(false),
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      background: 'rgba(0,0,0,0.5)',
      zIndex: 10010,
      transition: 'all 0.3s ease',
      opacity: mobileOpen ? 1 : 0,
      visibility: mobileOpen ? 'visible' : 'hidden'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: 300,
      height: '100vh',
      background: '#ffffff',
      borderRadius: '0 16px 16px 0',
      boxShadow: '4px 0px 16px 0px rgba(0,0,0,0.15)',
      padding: 24,
      zIndex: 10020,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s ease',
      transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      flex: 1
    }
  }, flatMobile.map((name, i) => /*#__PURE__*/React.createElement(NavItem, {
    key: name,
    label: name,
    mobile: true,
    active: i === 0,
    onSelect: select,
    onToggle: () => {}
  })), /*#__PURE__*/React.createElement(CtaButton, {
    label: ctaLabel,
    arrow: arrow,
    fullWidth: true,
    onClick: onCtaClick
  })), showLanguage && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: 24,
      borderTop: '1px solid var(--color-light-gray)'
    }
  }, languageButton(40)))));
}
Object.assign(__ds_scope, { Header });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Header.jsx", error: String((e && e.message) || e) }); }

// components/overlays/Modal.jsx
try { (() => {
function Modal({
  open = true,
  title,
  onClose,
  actions,
  width = 520,
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(30,30,30,0.45)',
      zIndex: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-narrow-l)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-white)',
      borderRadius: 'var(--radius-standard)',
      boxShadow: 'var(--shadow-card)',
      width: '100%',
      maxWidth: width,
      maxHeight: '90%',
      overflowY: 'auto',
      padding: 'var(--spacing-narrow-l)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 'var(--spacing-narrow-l)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-manrope)',
      fontWeight: 'var(--font-weight-bold)',
      fontSize: 'var(--font-size-title-large)',
      color: 'var(--color-text-blue)',
      margin: 0
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      width: 28,
      height: 28,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--color-primary-full)",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  })))), children, actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 'var(--spacing-narrow-m)',
      marginTop: 'var(--spacing-narrow-l)'
    }
  }, actions)));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlays/Modal.jsx", error: String((e && e.message) || e) }); }

// components/tables/Table.jsx
try { (() => {
function Table({
  columns = [],
  rows = [],
  renderCell
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 'var(--radius-standard)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
      gap: 'var(--spacing-narrow-l)',
      alignItems: 'center',
      padding: '16px 24px',
      background: '#fff',
      fontFamily: 'var(--font-manrope)',
      fontWeight: 'var(--font-weight-semibold)',
      fontSize: 'var(--font-size-content)',
      color: 'var(--color-primary-full)',
      boxShadow: 'var(--shadow-table-header)'
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("div", {
    key: c
  }, c))), rows.map((row, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
      gap: 'var(--spacing-narrow-l)',
      alignItems: 'center',
      padding: '16px 24px',
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--font-size-content)',
      color: 'var(--color-black)',
      borderTop: '1px solid var(--color-light-gray)'
    }
  }, columns.map((c, ci) => /*#__PURE__*/React.createElement("div", {
    key: c
  }, renderCell ? renderCell(row, c) : row[ci])))));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tables/Table.jsx", error: String((e && e.message) || e) }); }

__ds_ns.AppSidebar = __ds_scope.AppSidebar;

__ds_ns.AppTopbar = __ds_scope.AppTopbar;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.DropdownCard = __ds_scope.DropdownCard;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Stepper = __ds_scope.Stepper;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.StatusDot = __ds_scope.StatusDot;

__ds_ns.SocialIcon = __ds_scope.SocialIcon;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.ToggleSwitch = __ds_scope.ToggleSwitch;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.Header = __ds_scope.Header;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Table = __ds_scope.Table;

})();
