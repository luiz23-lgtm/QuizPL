import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Ignore DOM manipulation errors that are not critical
    if (error.message.includes('removeChild') || error.message.includes('insertBefore')) {
      console.warn('Ignoring non-critical DOM error:', error.message);
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Algo deu errado</h1>
            <p className="text-slate-400 mb-6">
              {this.state.error?.message || 'Ocorreu um erro inesperado. Tente novamente.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Recarregar página
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-2xl hover:bg-slate-600 transition flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Ir para início
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;