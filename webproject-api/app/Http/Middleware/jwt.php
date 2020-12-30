<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

use Closure;
use JWTAuth;

class jwt extends BaseMiddleware
{

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $this->checkForToken($request);

        try {
            if (!$this->auth->parseToken()->authenticate()) {
                return response()->json(['User not found!'], 404);
            }
            $payload = $this->auth->manager()->getPayloadFactory()->buildClaimsCollection()->toPlainArray();
            return $next($request); //Authenticated
        } catch (TokenExpiredException $e) {
            $payload = $this->auth->manager()->getPayloadFactory()->buildClaimsCollection()->toPlainArray();
            $key = 'block_refresh_token_for_user_' . $payload['sub'];
            $cachedBefore = (int) Cache::has($key); //Token was refreshed recently
            if ($cachedBefore) {
                auth()->onceUsingId($payload['sub']);
                return $next($request);
            }
            try {
                $newToken = $this->auth->refresh(false); //Refresh token with grace period to handle collisions
                $gracePeriod = $this->auth->manager()->getBlacklist()->getGracePeriod();
                $expiresAt = Carbon::now()->addSeconds($gracePeriod);
                Cache::put($key, $newToken, $expiresAt);
            } catch (TokenInvalidException $e) {
                return response()->json(['Token Invalid!'], 401);
            } catch (JWTException $e) {
                return response()->json(['Token absent!'], 401);
            }
        }

        $response = $next($request);

        return $this->setAuthenticationHeader($response, $newToken);
    }
}
