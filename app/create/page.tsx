import CreateGiftForm from '@/components/CreateGiftForm';

export const dynamic = 'force-dynamic';

export default function CreatePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎅</div>
          <h1 className="font-festive text-4xl text-christmas-gold mb-2">
            Create Santa&apos;s Message
          </h1>
          <p className="text-white/70">
            Fill in the details and let the magic begin!
          </p>
        </div>

        {/* Form Card */}
        <div className="card-frost p-8">
          <CreateGiftForm />
        </div>

        {/* Tips */}
        <div className="mt-8 card-frost p-6">
          <h3 className="font-festive text-xl text-christmas-gold mb-4 flex items-center gap-2">
            <span>💡</span> Tips for the Best Video
          </h3>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-christmas-green">✓</span>
              Be specific with the gift name - &quot;Red bicycle with training wheels&quot; works better than just &quot;bike&quot;
            </li>
            <li className="flex items-start gap-2">
              <span className="text-christmas-green">✓</span>
              Use the recipient&apos;s nickname if they have one - makes it more personal!
            </li>
            <li className="flex items-start gap-2">
              <span className="text-christmas-green">✓</span>
              Inside jokes and family references make Santa&apos;s message extra special
            </li>
            <li className="flex items-start gap-2">
              <span className="text-christmas-green">✓</span>
              Keep it family-friendly - Santa has standards!
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
