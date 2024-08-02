import "./globals.css";

export const metadata = {
  title: 'PantryPal Inventory Tracker',
  description: 'Your One Stop Shop for Inventory Management with AI',
}

export default function Home({ children }) {
  return (
    <html>
      <body>
        {children}
      </body>
      </html>
  )
}
