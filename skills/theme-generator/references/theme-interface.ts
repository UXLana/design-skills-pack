/**
 * Starter theme contract (ProductTheme)
 *
 * A starting point, not a standard. Use it only when the repo has no theme contract of its own
 * (see SKILL.md, Step 0). Copy it into the repo, then rename, add or drop keys to fit the
 * product. Every key here is generic UI; product-specific roles belong in your copy, not here.
 *
 * Contents
 *   ThemeColors .............. brand, accent, surface, surfaceBorder, text, border, icon, iconBg,
 *                              action, status, badge, avatar, dataViz, cvd, interaction states
 *                              (hover, selected, focusBorder, scrim), and small component roles
 *                              (scrollbar, navItemText, buttonToggleBg, chipBg,
 *                              progressIndicatorTrack, tableCellHighlight)
 *   ThemeTypography .......... font families, weights, line-height and letter-spacing tuning
 *   ThemeBorderRadius ........ radius scale + buildBorderRadius(base)
 *   ThemeElevation ........... shadow scale, including brand-tinted shadows
 *   ThemeSpacing ............. semantic spacing overrides (the numeric scale stays global)
 *   ThemeIconStyle ........... icon set, stroke width, corner style, size, per-icon overrides
 *   ThemeComponentRadius ..... per-component radii + buildComponentRadius(base, overrides)
 *   ProductTheme ............. the composite every theme implements
 *
 * Naming: colors come in onLight / onDark pairs so one theme can serve both surfaces.
 * Non-color groups (typography, radius, elevation, spacing, iconStyle) are meant to be emitted
 * as CSS custom properties at runtime (e.g. --ds-radius-md) so themes differ beyond color.
 *
 * To create a theme from this starter:
 * 1. Copy an existing theme file (e.g. default.ts) as a starting point
 * 2. Override every value in colors, typography, borderRadius, elevation, spacing, iconStyle
 * 3. Register it in the theme registry (e.g. theme-provider.tsx) and the themes barrel (index.ts)
 */

export interface ThemeColors {
  brand: {
    default: string;
    darker: string;
    lighter: string;
  };

  accent: {
    default: string;
    darker: string;
    lighter: string;
  };

  surface: {
    light: string;
    lightDarker: string;
    dark: string;
    darkDarker: string;
    disabled: {
      onLight: string;
      onDark: string;
    };
    info: string;
    success: string;
    warning: string;
    important: string;
  };

  surfaceBorder: {
    info: string;
    success: string;
    warning: string;
    important: string;
  };

  text: {
    highEmphasis: {
      onLight: string;
      onDark: string;
    };
    lowEmphasis: {
      onLight: string;
      onDark: string;
    };
    disabled: {
      onLight: string;
      onDark: string;
    };
    action: {
      enabled: string;
      hover: string;
      active: string;
    };
    success: string;
    warning: string;
    important: string;
  };

  border: {
    lowEmphasis: {
      onLight: string;
      onDark: string;
      hover: {
        onLight: string;
        onDark: string;
      };
    };
    midEmphasis: {
      onLight: string;
      onDark: string;
    };
    highEmphasis: {
      onLight: string;
      onDark: string;
    };
  };

  icon: {
    enabled: {
      onLight: string;
      onDark: string;
    };
    hover: {
      onLight: string;
    };
    active: {
      onLight: string;
    };
    selected: {
      onLight: string;
    };
    disabled: {
      onLight: string;
      onDark: string;
    };
    lowEmphasis: {
      enabled: {
        onLight: string;
        onDark: string;
      };
    };
  };

  iconBg: {
    info: string;
    info_onDark: string;
    success: string;
    success_onDark: string;
    warning: string;
    warning_onDark: string;
    important: string;
    important_onDark: string;
  };

  action: {
    enabled: string;
    hover: string;
    active: string;
    important: {
      enabled: string;
      hover: string;
      active: string;
    };
    monochrome: {
      onLight: {
        enabled: string;
        hover: string;
        active: string;
        selected: string;
        disabled: string;
        bg: string;
        lowEmphasis: {
          enabled: string;
        };
      };
      onDark: {
        enabled: string;
        hover: string;
        active: string;
        selected: string;
        disabled: string;
        bg: string;
        lowEmphasis: {
          enabled: string;
        };
      };
    };
  };

  status: {
    info: string;
    info_onDark: string;
    success: string;
    success_onDark: string;
    warning: string;
    warningLight: string;
    warning_onDark: string;
    important: string;
    important_onDark: string;
  };

  badge: {
    info: string;
    infoLight: string;
    success: string;
    successLight: string;
    warning: string;
    important: string;
    importantLight: string;
    aqua: string;
    aquaLight: string;
    green: string;
    greenLight: string;
    yellow: string;
    yellowLight: string;
    fuchsia: string;
    fuchsiaLight: string;
    purple: string;
    purpleLight: string;
    charcoal: string;
    charcoalLight: string;
  };

  avatar: Record<'01' | '02' | '03' | '04' | '05' | '06' | '07' | '08', string>;

  dataViz: {
    border: string;
  } & Record<'01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12' | '13' | '14' | '15', string>;

  cvd: {
    blue: string;
    lightBlue: string;
    yellow: string;
    green: string;
    orange: string;
    vermillion: string;
    pink: string;
    charcoal: string;
  };

  hover: {
    onLight: string;
    onDark: string;
  };

  selected: {
    onLight: string;
  };

  selectedHighlight: string;
  selectedHighlight_hover: string;

  focusBorder: {
    onLight: string;
    onDark: string;
  };

  scrim: string;

  scrollbar: {
    enabled: { onLight: string; onDark: string };
    hover: { onLight: string; onDark: string };
    active: { onLight: string; onDark: string };
  };

  navItemText: {
    enabled: { onLight: string; onDark: string };
  };

  buttonToggleBg: {
    onLight: string;
    onDark: string;
  };

  chipBg: {
    enabled: string;
    hover: string;
  };

  progressIndicatorTrack: string;

  tableCellHighlight: {
    highEmphasis: string;
    midEmphasis: string;
  };
}

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export interface ThemeTypography {
  /** Font family stacks — display (headings), body (paragraphs), mono (code) */
  fontFamilies: {
    display: string;
    body: string;
    mono: string;
  };
  /** Font weight values — all strings so they can be CSS-var-backed */
  fontWeights: {
    regular: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  /** Typographic scale tuning — line-height ratios and letter-spacing adjustments */
  scale: {
    /** Multiplier applied to tight line-heights (display/heading) — e.g. '1.2' */
    lineHeightTight: string;
    /** Multiplier applied to normal line-heights (body) — e.g. '1.5' */
    lineHeightNormal: string;
    /** Extra letter-spacing offset for headings — e.g. '-0.5px' */
    letterSpacingHeading: string;
    /** Extra letter-spacing offset for body text — e.g. '0px' */
    letterSpacingBody: string;
  };
}

// ---------------------------------------------------------------------------
// Border Radius
// ---------------------------------------------------------------------------

export interface ThemeBorderRadius {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

/**
 * Build a complete border radius scale from a single base value.
 * All tokens cascade from the base via fixed multipliers [1, 2, 4, 6, 8, 12, 16].
 * Changing the base for a theme updates every radius token consistently.
 *
 * Example bases: 1 = sharp and formal, 2-3 = balanced, 4 = soft (md radius 16px)
 */
export function buildBorderRadius(base: number): ThemeBorderRadius {
  return {
    none: '0px',
    xs: `${base}px`,
    sm: `${base * 2}px`,
    md: `${base * 4}px`,
    lg: `${base * 6}px`,
    xl: `${base * 8}px`,
    '2xl': `${base * 12}px`,
    '3xl': `${base * 16}px`,
    full: '9999px',
  };
}

// ---------------------------------------------------------------------------
// Elevation (Shadows)
// ---------------------------------------------------------------------------

export interface ThemeElevation {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  /** Brand-tinted shadow — tinted with the theme's brand color */
  brand: string;
  /** Larger brand-tinted shadow */
  brandLg: string;
}

// ---------------------------------------------------------------------------
// Spacing (semantic overrides only — the numeric 0-96 scale stays global)
// ---------------------------------------------------------------------------

export interface ThemeSpacing {
  /** Base spacing unit — e.g. '4px' */
  unit: string;
  /** Input internal padding — e.g. '12px' */
  inputPadding: string;
  /** Button internal padding — e.g. '16px' */
  buttonPadding: string;
  /** Card content padding — e.g. '24px' */
  cardPadding: string;
  /** Section-level padding — e.g. '48px' */
  sectionGap: string;
  /** Gap between sibling components — e.g. '16px' */
  componentGap: string;
}

// ---------------------------------------------------------------------------
// Icon Style
// ---------------------------------------------------------------------------

export type IconSetName = 'outlined' | 'filled' | 'duotone';

export interface ThemeIconStyle {
  /** Which icon set to use as default — 'outlined' | 'filled' | 'duotone' */
  set: string;
  /** Default stroke width for stroke-based icons — e.g. '1.5' */
  strokeWidth: string;
  /** Stroke cap/join style — 'round' | 'square' */
  cornerStyle: string;
  /** Default icon size in px — e.g. '20' */
  defaultSize: string;
  /** Per-icon overrides: { iconName: setName } — e.g. { Home: 'outlined' } */
  overrides: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Component Radius — derived from base, with per-theme overrides
// ---------------------------------------------------------------------------

export interface ThemeComponentRadius {
  badge: string;
  input: string;
  button: string;
  card: string;
  modal: string;
  chip: string;
  avatar: string;
}

/**
 * Build component-level border radii from the same base used in buildBorderRadius.
 * Each component has a default multiplier relative to the base:
 *
 *   badge  = base × 2  (= sm)
 *   input  = base × 2  (= sm)
 *   button = base × 3  (between sm and md — unique to buttons)
 *   card   = base × 6  (= lg)
 *   modal  = base × 8  (= xl)
 *   chip   = full (9999px)
 *   avatar = full (9999px)
 *
 * Pass overrides to replace any default for a specific theme.
 */
export function buildComponentRadius(
  base: number,
  overrides?: Partial<ThemeComponentRadius>,
): ThemeComponentRadius {
  return {
    badge:  `${base * 2}px`,
    input:  `${base * 2}px`,
    button: `${base * 3}px`,
    card:   `${base * 6}px`,
    modal:  `${base * 8}px`,
    chip:   '9999px',
    avatar: '9999px',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Product Theme (composite)
// ---------------------------------------------------------------------------

export interface ProductTheme {
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  borderRadius: ThemeBorderRadius;
  elevation: ThemeElevation;
  spacing: ThemeSpacing;
  iconStyle: ThemeIconStyle;
  componentRadius: ThemeComponentRadius;
}
