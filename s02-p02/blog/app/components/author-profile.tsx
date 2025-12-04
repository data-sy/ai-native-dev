import Image from 'next/image'

export default function AuthorProfile() {
  return (
    <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 mt-12">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
          <Image
            src="/images/avatar.svg"
            alt="Author avatar"
            width={64}
            height={64}
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
            Your Name
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            A passionate developer who loves Vim, tabs, and static typing. Always learning and sharing knowledge through writing.
          </p>
        </div>
      </div>
    </div>
  )
}
