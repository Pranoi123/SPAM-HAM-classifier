export default function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Spam Classifier System</p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            Helping improve message classification with user feedback
          </p>
        </div>
      </div>
    </footer>
  )
}
