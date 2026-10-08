import os

def get_emblem_svg(is_light_mode=False):
    """
    Returns the SVG group elements for the PW + House Monogram.
    is_light_mode: True for dark backgrounds (footer), False for light backgrounds (navbar).
    """
    # In light mode (dark background like footer):
    # - Gold is brilliant, glowing, reflective
    # - Wood is rich walnut with warm highlights
    # In dark mode (light background like navbar):
    # - Gold is rich warm bronze/gold with deep contrast
    # - Wood is dark chocolate/walnut
    
    gold_grad_id = "goldGradLight" if is_light_mode else "goldGradDark"
    wood_grad_id = "woodGradLight" if is_light_mode else "woodGradDark"
    bevel_id = "bevelGradLight" if is_light_mode else "bevelGradDark"
    window_id = "windowGradLight" if is_light_mode else "windowGradDark"

    return f"""
    <!-- Defs & Gradients -->
    <defs>
      <!-- Luxury Brushed Gold Gradient -->
      <linearGradient id="{gold_grad_id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F3D78A"/>
        <stop offset="25%" stop-color="#DFB559"/>
        <stop offset="50%" stop-color="#FCE5A2"/>
        <stop offset="75%" stop-color="#C59A44"/>
        <stop offset="100%" stop-color="#9C7225"/>
      </linearGradient>

      <!-- Polished Gold Bevel Accent -->
      <linearGradient id="{bevel_id}" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#8E6620"/>
        <stop offset="35%" stop-color="#DFB559"/>
        <stop offset="70%" stop-color="#FFF2CA"/>
        <stop offset="100%" stop-color="#A57A28"/>
      </linearGradient>

      <!-- Rich Walnut Wood Gradient -->
      <linearGradient id="{wood_grad_id}" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stop-color="#4E2A17"/>
        <stop offset="40%" stop-color="#3B1E0F"/>
        <stop offset="70%" stop-color="#552F1B"/>
        <stop offset="100%" stop-color="#241107"/>
      </linearGradient>

      <!-- Glowing House Window Gradient -->
      <linearGradient id="{window_id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFF3D1"/>
        <stop offset="50%" stop-color="#F7CE65"/>
        <stop offset="100%" stop-color="#DCA132"/>
      </linearGradient>

      <!-- Subtle 3D Shadow -->
      <filter id="pwcDropShadow" x="-15%" y="-15%" width="135%" height="135%">
        <feDropShadow dx="1.5" dy="2.5" stdDeviation="2" flood-color="#000000" flood-opacity="0.32"/>
      </filter>
    </defs>

    <!-- Monogram Emblem Group -->
    <g class="pwc-emblem-group" filter="url(#pwcDropShadow)">
      
      <!-- 1. THE 'P' STEM (Vertical Column) -->
      <!-- Bevel Base / 3D Extrusion on Left -->
      <path d="M 17 14 L 21 17 L 21 103 L 17 106 Z" fill="url(#{bevel_id})" />
      <!-- P Stem Main Face (Walnut) -->
      <path d="M 21 17 L 38 17 L 38 103 L 21 103 Z" fill="url(#{wood_grad_id})" />
      <!-- Gold Inner Edge Highlight -->
      <line x1="38" y1="17" x2="38" y2="103" stroke="url(#{gold_grad_id})" stroke-width="1.2" opacity="0.85"/>
      <!-- Top Bevel of Stem -->
      <polygon points="17,14 38,14 38,17 21,17" fill="url(#{gold_grad_id})"/>

      <!-- 2. THE HOUSE GABLE SILHOUETTE (Under the loop of P) -->
      <!-- Peaked Roof Beam / Eaves -->
      <path d="M 33 41 L 57 23 L 79 40 L 75 43 L 57 28 L 36 44 Z" 
            fill="url(#{gold_grad_id})" />
      
      <!-- Roof Peak Ridge Line & Accent -->
      <polyline points="34,42 57,24 78,41" 
                stroke="#FFF2CA" stroke-width="1" fill="none" opacity="0.9"/>

      <!-- 4-Pane Square Window Grid -->
      <!-- Top-Left Pane -->
      <rect x="52.5" y="32" width="4.2" height="4.2" rx="0.5" fill="url(#{window_id})" />
      <!-- Top-Right Pane -->
      <rect x="58.2" y="32" width="4.2" height="4.2" rx="0.5" fill="url(#{window_id})" />
      <!-- Bottom-Left Pane -->
      <rect x="52.5" y="37.7" width="4.2" height="4.2" rx="0.5" fill="url(#{window_id})" />
      <!-- Bottom-Right Pane -->
      <rect x="58.2" y="37.7" width="4.2" height="4.2" rx="0.5" fill="url(#{window_id})" />
      
      <!-- Window Frame Mullion Outline -->
      <rect x="52" y="31.5" width="11" height="11" rx="0.6" stroke="url(#{bevel_id})" stroke-width="0.8" fill="none" opacity="0.75"/>

      <!-- 3. THE 'P' LOOP / ARCH -->
      <!-- Outer Arch with Walnut wood & Gold Bevel -->
      <!-- Outer Bevel Rim -->
      <path d="M 38 14 C 64 14 83 24 88 41 C 92 56 81 67 65 67 L 46 67 L 46 61 L 64 61 C 76 61 84 53 81 41 C 78 28 62 19 38 19 Z" 
            fill="url(#{bevel_id})" />
      <!-- Main Face of P Arch (Walnut) -->
      <path d="M 38 16 C 62 16 80 25 85 41 C 89 54 80 64 64 64 L 46 64 L 46 59 L 64 59 C 75 59 82 52 79 41 C 76 29 61 21 38 21 Z" 
            fill="url(#{wood_grad_id})" />
      <!-- Gold Rim Edge Highlight -->
      <path d="M 38 14 C 64 14 83 24 88 41 C 92 56 81 67 65 67" 
            stroke="url(#{gold_grad_id})" stroke-width="1.8" fill="none" stroke-linecap="round"/>

      <!-- 4. THE INTERLOCKING 'W' (Dimensional 3D Wood + Gold Facets) -->
      <!-- Left Leg of W (passes through / behind P) -->
      <polygon points="41,56 47,56 36,97 29,97" fill="url(#{bevel_id})" />
      <polygon points="42,56 48,56 38,94 32,94" fill="url(#{wood_grad_id})" />

      <!-- Center Upward Diagonal of W (Major intersecting stroke) -->
      <!-- Bottom apex -->
      <polygon points="30,96 38,96 68,48 60,48" fill="url(#{bevel_id})" />
      <polygon points="33,94 40,94 67,51 60,51" fill="url(#{wood_grad_id})" />
      <!-- Center Upward Gold Chamfer -->
      <line x1="38" y1="96" x2="68" y2="48" stroke="url(#{gold_grad_id})" stroke-width="2.2" stroke-linecap="round"/>

      <!-- Right Downward & Upward Diagonal Wings of W -->
      <!-- Downward stroke from center -->
      <polygon points="60,48 68,48 76,96 68,96" fill="url(#{wood_grad_id})" />
      <polygon points="68,48 70,48 78,96 76,96" fill="url(#{bevel_id})" />

      <!-- Far Right Wing of W (Angled upward architectural wing) -->
      <!-- Extrusion / 3D Side -->
      <polygon points="68,96 78,96 103,32 95,30" fill="url(#{bevel_id})" />
      <!-- Front Face (Walnut) -->
      <polygon points="71,94 79,94 100,34 94,33" fill="url(#{wood_grad_id})" />
      <!-- Outer Gold Bevel Edge -->
      <polyline points="78,96 103,32 95,30" stroke="url(#{gold_grad_id})" stroke-width="2" fill="none" stroke-linecap="round"/>

      <!-- Center Interlock Cutout Accent: subtle metallic notch -->
      <path d="M 44 65 L 56 65 L 53 71 L 41 71 Z" fill="url(#{gold_grad_id})" opacity="0.9"/>
    </g>
    """

def create_horizontal_logo(filename, is_light_mode=False):
    """
    Creates pwc-logo.svg (navbar) or pwc-logo-light.svg (footer).
    ViewBox: 0 0 460 120
    Emblem on left: ~100x100
    Typography on right: "PIRO WOODY" + "— C O N C E P T S —" + subtitle
    """
    emblem = get_emblem_svg(is_light_mode)
    
    if is_light_mode:
        # Footer / Dark background:
        # Piro Woody in brilliant glowing gold
        title_fill = "url(#goldGradLight)"
        concepts_fill = "#F3D78A"
        line_stroke = "#DFB559"
        subtitle_fill = "#D9CEC4"
    else:
        # Navbar / Light background:
        # Piro Woody in rich deep walnut/bronze with gold sheen
        title_fill = "#2B160C"
        concepts_fill = "#9E7326"
        line_stroke = "#C59A44"
        subtitle_fill = "#6B584C"

    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 120" fill="none">
{emblem}

  <!-- Typography on Right -->
  <g transform="translate(122, 22)">
    <!-- Primary Brand Title -->
    <text x="0" y="35" 
          font-family="'Cinzel', 'Playfair Display', 'Georgia', serif" 
          font-size="29" 
          font-weight="700" 
          letter-spacing="3.5" 
          fill="{title_fill}">
      PIRO WOODY
    </text>

    <!-- Accent Divider Bars & CONCEPTS -->
    <g transform="translate(0, 56)">
      <!-- Left Accent Line -->
      <line x1="0" y1="-5" x2="28" y2="-5" stroke="{line_stroke}" stroke-width="1.8" stroke-linecap="round"/>
      
      <!-- Spaced CONCEPTS -->
      <text x="36" y="0" 
            font-family="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" 
            font-size="12.5" 
            font-weight="700" 
            letter-spacing="6.5" 
            fill="{concepts_fill}">
        CONCEPTS
      </text>

      <!-- Right Accent Line -->
      <line x1="202" y1="-5" x2="295" y2="-5" stroke="{line_stroke}" stroke-width="1.8" stroke-linecap="round"/>
    </g>

    <!-- Subtitle / Craft Tagline -->
    <text x="0" y="80" 
          font-family="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" 
          font-size="9" 
          font-weight="600" 
          letter-spacing="2.2" 
          fill="{subtitle_fill}">
      MODERN INTERIORS • FURNITURE • CRAFTSMANSHIP
    </text>
  </g>
</svg>
"""
    with open(filename, "w", encoding="utf-8") as f:
        f.write(svg_content)
    print(f"Created {filename}")

def create_favicon(filename):
    """
    Creates favicon.svg with the simplified PW + House monogram on a rounded luxury plaque.
    ViewBox: 0 0 64 64
    """
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="favBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3A1F11"/>
      <stop offset="50%" stop-color="#24130A"/>
      <stop offset="100%" stop-color="#150A05"/>
    </linearGradient>

    <linearGradient id="favGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCE5A2"/>
      <stop offset="50%" stop-color="#DFB559"/>
      <stop offset="100%" stop-color="#9C7225"/>
    </linearGradient>

    <linearGradient id="favWood" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#552F1B"/>
      <stop offset="100%" stop-color="#32180C"/>
    </linearGradient>
  </defs>

  <!-- Luxury Rounded Background Plaque -->
  <rect width="64" height="64" rx="14" fill="url(#favBg)"/>
  <rect x="2" y="2" width="60" height="60" rx="12" stroke="url(#favGold)" stroke-width="1.6" stroke-opacity="0.85"/>

  <!-- PW + House Monogram Scaled for Favicon (Scale ~0.48, Offset (7, 6)) -->
  <g transform="translate(6, 6) scale(0.44)">
    <!-- P Stem -->
    <path d="M 18 16 L 36 16 L 36 102 L 18 102 Z" fill="url(#favGold)"/>
    
    <!-- House Gable Roof -->
    <path d="M 32 40 L 56 22 L 80 40 L 76 43 L 56 27 L 35 43 Z" fill="url(#favGold)"/>
    
    <!-- 4-Pane Window Grid -->
    <rect x="51.5" y="31.5" width="4" height="4" rx="0.5" fill="#FFEAA8"/>
    <rect x="57" y="31.5" width="4" height="4" rx="0.5" fill="#FFEAA8"/>
    <rect x="51.5" y="37" width="4" height="4" rx="0.5" fill="#FFEAA8"/>
    <rect x="57" y="37" width="4" height="4" rx="0.5" fill="#FFEAA8"/>

    <!-- P Loop / Arch -->
    <path d="M 36 16 C 62 16 82 25 86 41 C 90 55 80 65 64 65 L 46 65 L 46 58 L 64 58 C 75 58 82 51 79 41 C 76 29 61 21 36 21 Z" 
          fill="url(#favGold)"/>

    <!-- W Interlocking Center Stroke -->
    <polygon points="32,96 40,96 68,48 60,48" fill="url(#favGold)"/>
    
    <!-- W Right Wing Stroke -->
    <polygon points="68,96 77,96 102,32 93,31" fill="url(#favGold)"/>
  </g>
</svg>
"""
    with open(filename, "w", encoding="utf-8") as f:
        f.write(svg_content)
    print(f"Created {filename}")

if __name__ == "__main__":
    logo_dir = r"c:\Users\ELITEBOOK\Desktop\piro-woody concept\assets\logo"
    create_horizontal_logo(os.path.join(logo_dir, "pwc-logo.svg"), is_light_mode=False)
    create_horizontal_logo(os.path.join(logo_dir, "pwc-logo-light.svg"), is_light_mode=True)
    create_favicon(os.path.join(logo_dir, "favicon.svg"))
    print("Done generating logos.")
