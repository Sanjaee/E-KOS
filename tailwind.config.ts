import type { Config } from "tailwindcss";
const { default: flattenColorPalette } = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
  	extend: {
  		backgroundImage: {
  			'gradient-moving': 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)'
  		},
  		colors: {
  			lightBg: '#ffffff',
  			lightText: '#1a1a1a',
  			darkBg: '#000000',
  			darkText: '#e4e4e7',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		keyframes: {
  			blink: {
  				'0%, 100%': {
  					color: 'black'
  				},
  				'50%': {
  					color: 'red'
  				}
  			},
  			gradientX: {
  				'0%': {
  					backgroundPosition: '0% 50%'
  				},
  				'50%': {
  					backgroundPosition: '100% 50%'
  				},
  				'100%': {
  					backgroundPosition: '0% 50%'
  				}
  			},
  			shimmer: {
  				from: {
  					backgroundPosition: '0 0'
  				},
  				to: {
  					backgroundPosition: '200% 0'
  				}
  			}
  		},
  		animation: {
  			blink: 'blink 1s ease-in-out infinite',
  			'gradient-x': 'gradientX 4s ease infinite',
  			'text-shimmer': 'shimmer 8s linear infinite'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [addVariablesForColors, addGradientClasses, require("tailwindcss-animate")],
};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
  
  addBase({
    ":root": newVars,
  });
}

function addGradientClasses({ matchUtilities, theme }: any) {
  matchUtilities(
    {
      'text-gradient': (value: string) => ({
        'background-image': value,
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
        'background-clip': 'text',
        'background-size': '200% auto',
        'background-position': '0 0',
        'background-repeat': 'repeat',
      }),
    },
    {
      values: {
        'purple-blue': 'linear-gradient(to right, #6366f1, #8b5cf6)',
        'blue-purple': 'linear-gradient(to right, #8b5cf6, #6366f1)',
        'pink-purple': 'linear-gradient(to right, #ec4899, #8b5cf6)',
        'blue-pink': 'linear-gradient(to right, #6366f1, #ec4899)',
        'triple': 'linear-gradient(to right, #6366f1, #8b5cf6, #ec4899)',
      },
    }
  );
}

export default config;