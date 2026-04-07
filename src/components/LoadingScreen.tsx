export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 h-12 w-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}
