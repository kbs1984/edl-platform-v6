import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function CallSignPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/');

  // Server action to save call sign
  async function saveCallSign(formData: FormData) {
    'use server';
    const callSign = formData.get('call_sign') as string;
    
    // Validate format
    if (!/^[a-z0-9-]+$/.test(callSign)) {
      return { error: 'Invalid format. Use lowercase letters, numbers, and hyphens only.' };
    }
    
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'User not authenticated.' };
    }
    
    // Check availability
    const { data: existing } = await supabase
      .from('student')
      .select('call_sign')
      .eq('call_sign', callSign)
      .single();
      
    if (existing) {
      return { error: 'Call sign already taken. Please choose another.' };
    }
    
    // Save to database
    const { error } = await supabase
      .from('student')
      .update({ call_sign: callSign })
      .eq('user_id', user.id);
      
    if (!error) {
      redirect('/');
    }
    
    return { error: 'Failed to save call sign. Please try again.' };
  }

  // Generate suggestions
  const adjectives = ['swift', 'brave', 'wise', 'bold', 'keen'];
  const nouns = ['eagle', 'wolf', 'owl', 'hawk', 'fox'];
  const number = Math.floor(Math.random() * 99) + 1;
  const suggestions = adjectives.map(adj => 
    `${adj}-${nouns[Math.floor(Math.random() * nouns.length)]}-${number}`
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Choose Your Call Sign</h2>
          <p className="mt-2 text-gray-600">
            Your unique identity in the EDL Platform
          </p>
        </div>
        
        <form action={saveCallSign} className="mt-8 space-y-6">
          <div>
            <label htmlFor="call_sign" className="block text-sm font-medium text-gray-700">
              Call Sign
            </label>
            <input
              id="call_sign"
              name="call_sign"
              type="text"
              required
              pattern="[a-z0-9-]+"
              maxLength={30}
              placeholder="swift-eagle-42"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            <p className="mt-2 text-sm text-gray-500">
              Use lowercase letters, numbers, and hyphens only
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Need inspiration?</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={(e) => {
                    const input = document.getElementById('call_sign') as HTMLInputElement;
                    input.value = suggestion;
                  }}
                  className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 hover:bg-blue-100"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Set Call Sign
          </button>
        </form>
      </div>
    </div>
  );
}