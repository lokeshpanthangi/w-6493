
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				dicey: {
					purple: {
						DEFAULT: '#9b87f5',
						dark: '#7e69ab',
						light: '#bfb3f8',
					},
					yellow: {
						DEFAULT: '#ffd452',
						dark: '#ebc245',
						light: '#ffe38a',
					},
					blue: {
						DEFAULT: '#33c3f0',
						dark: '#1eaedb',
						light: '#7fdbfc',
					},
					gray: {
						light: '#f9f9fc',
						DEFAULT: '#e1e1e8',
						dark: '#2d3142',
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				"accordion-up": {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				"dice-roll": {
					"0%": { transform: "rotateX(0) rotateY(0)" },
					"25%": { transform: "rotateX(180deg) rotateY(90deg)" },
					"50%": { transform: "rotateX(360deg) rotateY(180deg)" },
					"75%": { transform: "rotateX(270deg) rotateY(270deg)" },
					"100%": { transform: "rotateX(360deg) rotateY(360deg)" },
				},
				"float": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" },
				},
				"bounce-small": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-4px)" },
				},
				"spin-slow": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				"fade-in-up": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"fade-out": {
					"0%": { opacity: "1" },
					"100%": { opacity: "0" },
				},
				"zoom-in": {
					"0%": { transform: "scale(0.95)", opacity: "0" },
					"100%": { transform: "scale(1)", opacity: "1" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"dice-roll": "dice-roll 1.2s ease-in-out",
				"float": "float 3s ease-in-out infinite",
				"bounce-small": "bounce-small 2s ease-in-out infinite",
				"spin-slow": "spin-slow 6s linear infinite",
				"fade-in": "fade-in 0.3s ease-out",
				"fade-in-up": "fade-in-up 0.4s ease-out",
				"fade-out": "fade-out 0.3s ease-out",
				"zoom-in": "zoom-in 0.2s ease-out",
			},
			fontFamily: {
				poppins: ["Poppins", "sans-serif"],
				inter: ["Inter", "sans-serif"],
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
