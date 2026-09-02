/**
 * API Debug & Telemetry Logger
 * Tracks authentication, registry querying, and installation endpoint execution.
 * Captures request/response payloads, HTTP status codes, edge gateway invocation errors (e.g. bom1 FUNCTION_INVOCATION_FAILED),
 * and provides structured diagnostics.
 */

export interface NetworkTracePayload {
  endpoint: string;
  method: string;
  status?: number;
  statusText?: string;
  durationMs: number;
  timestamp: string;
  requestHeaders?: Record<string, string>;
  requestPayload?: any;
  responsePayload?: any;
  rawResponseBody?: string;
  gatewayErrorId?: string;
  fallbackEngaged?: boolean;
  userContext?: string;
}

export interface ApiLogEntry {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  status?: number;
  statusText?: string;
  durationMs: number;
  requestPayload?: any;
  responsePayload?: any;
  errorMessage?: string;
  gatewayErrorId?: string;
  networkTrace?: NetworkTracePayload;
  type: 'AUTH' | 'INSTALL' | 'CONFIG' | 'REGISTRY' | 'AUDIT';
  success: boolean;
}

class ApiDebugLogger {
  private logs: ApiLogEntry[] = [];
  private maxLogs: number = 100;

  /**
   * Log an API request lifecycle with structured network trace payloads
   */
  log(entry: Omit<ApiLogEntry, 'id' | 'timestamp'> & { networkTrace?: NetworkTracePayload }): ApiLogEntry {
    const fullEntry: ApiLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString()
    };

    this.logs.unshift(fullEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // Console output for immediate developer visibility & network trace diagnostics
    if (!fullEntry.success || (fullEntry.status && fullEntry.status >= 400)) {
      console.group(`🚨 [API-DEBUG NETWORK TRACE] ${fullEntry.method} ${fullEntry.endpoint} [Status: ${fullEntry.status || 'FAILED'}]`);
      console.error('Timestamp:', fullEntry.timestamp);
      console.error('Duration:', `${fullEntry.durationMs}ms`);
      if (fullEntry.requestPayload) console.error('Request Payload:', fullEntry.requestPayload);
      if (fullEntry.responsePayload) console.error('Response Body:', fullEntry.responsePayload);
      if (fullEntry.errorMessage) console.error('Error Message:', fullEntry.errorMessage);
      if (fullEntry.gatewayErrorId) console.error('Gateway Error Code:', fullEntry.gatewayErrorId);
      if (fullEntry.networkTrace) {
        console.table({
          Endpoint: fullEntry.networkTrace.endpoint,
          Method: fullEntry.networkTrace.method,
          Status: fullEntry.networkTrace.status ?? 'ERR',
          Latency: `${fullEntry.networkTrace.durationMs}ms`,
          FallbackEngaged: fullEntry.networkTrace.fallbackEngaged ? 'YES' : 'NO'
        });
        console.info('Full Network Trace Object:', fullEntry.networkTrace);
      }
      console.groupEnd();
    } else {
      console.log(`✅ [API-DEBUG] ${fullEntry.method} ${fullEntry.endpoint} [${fullEntry.status}] (${fullEntry.durationMs}ms)`);
    }

    return fullEntry;
  }

  /**
   * Safe fetch wrapper that automatically logs all telemetry,
   * captures 500 error bodies, and extracts Edge / Cloud Run FUNCTION_INVOCATION_FAILED codes.
   */
  async instrumentedFetch(
    url: string,
    options: RequestInit = {},
    type: ApiLogEntry['type'] = 'AUTH'
  ): Promise<{ response: Response | null; data: any; error: string | null; isOk: boolean }> {
    const startTime = performance.now();
    let requestPayload: any = null;
    if (options.body && typeof options.body === 'string') {
      try {
        requestPayload = JSON.parse(options.body);
      } catch {
        requestPayload = options.body;
      }
    }

    try {
      const res = await fetch(url, options);
      const durationMs = Math.round(performance.now() - startTime);
      const rawText = await res.text();
      let parsedData: any = null;

      try {
        parsedData = JSON.parse(rawText);
      } catch {
        parsedData = rawText;
      }

      // Check for Edge Gateway invocation failure (e.g. bom1::..., FUNCTION_INVOCATION_FAILED)
      let gatewayErrorId: string | undefined;
      if (typeof rawText === 'string' && (rawText.includes('FUNCTION_INVOCATION_FAILED') || rawText.includes('bom1::') || rawText.includes('A server error has occurred'))) {
        const match = rawText.match(/bom1::[a-zA-Z0-9\-_]+/);
        gatewayErrorId = match ? match[0] : 'EDGE_INVOCATION_FAILED';
      }

      const isSuccess = res.ok && !gatewayErrorId;

      const trace: NetworkTracePayload = {
        endpoint: url,
        method: options.method || 'GET',
        status: res.status,
        statusText: res.statusText,
        durationMs,
        timestamp: new Date().toISOString(),
        requestHeaders: options.headers as Record<string, string>,
        requestPayload,
        responsePayload: parsedData,
        rawResponseBody: rawText,
        gatewayErrorId,
        fallbackEngaged: !isSuccess
      };

      this.log({
        endpoint: url,
        method: options.method || 'GET',
        status: res.status,
        statusText: res.statusText,
        durationMs,
        requestPayload,
        responsePayload: parsedData,
        errorMessage: isSuccess ? undefined : (typeof parsedData === 'string' ? parsedData : parsedData?.error || 'HTTP Error'),
        gatewayErrorId,
        networkTrace: trace,
        type,
        success: isSuccess
      });

      return {
        response: res,
        data: parsedData,
        error: isSuccess ? null : `Status ${res.status}: ${gatewayErrorId || 'Request failed'}`,
        isOk: isSuccess
      };
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - startTime);
      const errorMsg = err?.message || 'Network / Connectivity Failure';

      const trace: NetworkTracePayload = {
        endpoint: url,
        method: options.method || 'GET',
        status: 0,
        statusText: 'FETCH_EXCEPTION',
        durationMs,
        timestamp: new Date().toISOString(),
        requestPayload,
        rawResponseBody: errorMsg,
        fallbackEngaged: true
      };

      this.log({
        endpoint: url,
        method: options.method || 'GET',
        status: 0,
        statusText: 'FETCH_EXCEPTION',
        durationMs,
        requestPayload,
        errorMessage: errorMsg,
        networkTrace: trace,
        type,
        success: false
      });

      return {
        response: null,
        data: null,
        error: errorMsg,
        isOk: false
      };
    }
  }

  getLogs(): ApiLogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const apiDebugLogger = new ApiDebugLogger();
export default apiDebugLogger;
