<?php namespace GEDB\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Config;

class ConfiguredBasicAuth {
    /**
     * The Guard implementation.
     *
     * @var Guard
     */
    protected $auth;
    /**
     * Create a new filter instance.
     *
     * @param  Guard  $auth
     * @return void
     */
    public function __construct(Guard $auth)
    {
        $this->auth = $auth;
    }
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (Config::get('auth.basic_required') === true) {
            return $this->auth->basic() ?: $next($request);
        } else {
            return $next($request);
        }
    }
}