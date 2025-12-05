<?php

// example-app/app/Exceptions/RegisterFailedException.php

namespace App\Exceptions;

use Exception;

// 判斷為過度設計，建議不使用
class RegisterFailedException extends Exception
{
    protected $message;

    protected $status;

    public function __construct($message = 'Registration failed', $status = Response::HTTP_INTERNAL_SERVER_ERROR)
    {
        parent::__construct($message);
        $this->status = $status;
    }

    public function getStatusCode()
    {
        return $this->status;
    }
}
