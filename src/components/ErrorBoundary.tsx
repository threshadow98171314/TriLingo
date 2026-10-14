// 畫面出錯時的保護網：不讓使用者看到一片空白，並提供回首頁、備份存檔的出路。
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { exportSave } from '../core/store';

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('畫面發生錯誤', error, info.componentStack);
  }

  private backup = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([exportSave()], { type: 'application/json' }));
    a.download = 'trilingo-save-backup.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="page narrow">
        <div className="empty card">
          <div className="empty-icon">🛠️</div>
          <h2>這個畫面出了點問題</h2>
          <p className="muted">你的學習進度沒有受影響。回到首頁通常就能繼續；如果一直發生，可以先備份存檔。</p>
          <pre className="error-detail">{this.state.error.message}</pre>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={this.backup}>
              備份存檔
            </button>
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                location.hash = '/';
                location.reload();
              }}
            >
              回首頁
            </button>
          </div>
        </div>
      </div>
    );
  }
}
