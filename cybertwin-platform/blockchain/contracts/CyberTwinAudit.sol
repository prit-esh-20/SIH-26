// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title CyberTwinAudit
 * @notice Tamper-evident audit registry for CyberTwin security events.
 *
 * Sensitive behavioral telemetry is NOT stored on-chain.
 * Only cryptographic hashes and security-event metadata are recorded.
 */
contract CyberTwinAudit {

    // ============================================================
    // STRUCTS
    // ============================================================

    struct SecurityEvent {
        bytes32 eventId;
        bytes32 userIdHash;
        bytes32 eventHash;

        uint256 riskScore;

        string riskLevel;

        bool isAnomalous;

        uint256 timestamp;

        address recordedBy;
    }


    // ============================================================
    // STATE
    // ============================================================

    address public owner;

    mapping(address => bool) public authorizedRecorders;

    mapping(bytes32 => SecurityEvent) private securityEvents;

    mapping(bytes32 => bool) public eventExists;


    // ============================================================
    // EVENTS
    // ============================================================

    event SecurityEventRecorded(
        bytes32 indexed eventId,
        bytes32 indexed userIdHash,
        bytes32 eventHash,
        uint256 riskScore,
        string riskLevel,
        bool isAnomalous,
        uint256 timestamp,
        address indexed recordedBy
    );

    event RecorderAuthorized(
        address indexed recorder
    );

    event RecorderRevoked(
        address indexed recorder
    );


    // ============================================================
    // MODIFIERS
    // ============================================================

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only owner can perform this action"
        );

        _;
    }

    modifier onlyAuthorizedRecorder() {
        require(
            authorizedRecorders[msg.sender],
            "Not an authorized recorder"
        );

        _;
    }


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    constructor() {

        owner = msg.sender;

        authorizedRecorders[msg.sender] = true;

        emit RecorderAuthorized(msg.sender);
    }


    // ============================================================
    // RECORDER MANAGEMENT
    // ============================================================

    function authorizeRecorder(
        address recorder
    )
        external
        onlyOwner
    {
        require(
            recorder != address(0),
            "Invalid recorder address"
        );

        authorizedRecorders[recorder] = true;

        emit RecorderAuthorized(
            recorder
        );
    }


    function revokeRecorder(
        address recorder
    )
        external
        onlyOwner
    {
        require(
            recorder != owner,
            "Owner cannot be revoked"
        );

        authorizedRecorders[recorder] = false;

        emit RecorderRevoked(
            recorder
        );
    }


    // ============================================================
    // RECORD SECURITY EVENT
    // ============================================================

    function recordSecurityEvent(
        bytes32 eventId,
        bytes32 userIdHash,
        bytes32 eventHash,
        uint256 riskScore,
        string calldata riskLevel,
        bool isAnomalous
    )
        external
        onlyAuthorizedRecorder
    {
        require(
            !eventExists[eventId],
            "Event already recorded"
        );

        // Risk score stored with 2 decimal places.
        // Example: 98.46 is stored as 9846.
        require(
            riskScore <= 10000,
            "Risk score must be between 0 and 100"
        );

        require(
            eventId != bytes32(0),
            "Invalid event ID"
        );

        require(
            eventHash != bytes32(0),
            "Invalid event hash"
        );

        securityEvents[eventId] = SecurityEvent({
            eventId: eventId,
            userIdHash: userIdHash,
            eventHash: eventHash,
            riskScore: riskScore,
            riskLevel: riskLevel,
            isAnomalous: isAnomalous,
            timestamp: block.timestamp,
            recordedBy: msg.sender
        });

        eventExists[eventId] = true;

        emit SecurityEventRecorded(
            eventId,
            userIdHash,
            eventHash,
            riskScore,
            riskLevel,
            isAnomalous,
            block.timestamp,
            msg.sender
        );
    }


    // ============================================================
    // RETRIEVE SECURITY EVENT
    // ============================================================

    function getSecurityEvent(
        bytes32 eventId
    )
        external
        view
        returns (
            bytes32,
            bytes32,
            bytes32,
            uint256,
            string memory,
            bool,
            uint256,
            address
        )
    {
        require(
            eventExists[eventId],
            "Event does not exist"
        );

        SecurityEvent memory securityEvent =
            securityEvents[eventId];

        return (
            securityEvent.eventId,
            securityEvent.userIdHash,
            securityEvent.eventHash,
            securityEvent.riskScore,
            securityEvent.riskLevel,
            securityEvent.isAnomalous,
            securityEvent.timestamp,
            securityEvent.recordedBy
        );
    }


    // ============================================================
    // VERIFY EVENT HASH
    // ============================================================

    function verifyEvent(
        bytes32 eventId,
        bytes32 eventHash
    )
        external
        view
        returns (bool)
    {
        require(
            eventExists[eventId],
            "Event does not exist"
        );

        return (
            securityEvents[eventId].eventHash
            == eventHash
        );
    }
}