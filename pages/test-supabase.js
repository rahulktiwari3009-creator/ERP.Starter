import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function TestSupabase({ connected, data }) {
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Supabase Connection Test</h1>
      {connected ? (
        <>
          <p style={{ color: "green" }}>✅ Connected to Supabase successfully!</p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
      ) : (
        <p style={{ color: "red" }}>❌ Failed to connect. Check keys or URL.</p>
      )}
    </div>
  )
}

export async function getServerSideProps() {
  try {
    // yaha table name "users" hai
    const { data, error } = await supabase.from('users').select('*').limit(5)

    if (error) {
      console.error(error)
      return { props: { connected: false, data: null } }
    }

    return { props: { connected: true, data } }
  } catch (err) {
    console.error(err)
    return { props: { connected: false, data: null } }
  }
}
